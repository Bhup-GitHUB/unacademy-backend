import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import pdftopic from 'pdftopic'
import supabase from '../supabase'
import { authMiddleware } from '../middleware/auth'

const slides = new Hono()
const prisma = new PrismaClient()

// Utility function to handle file upload from FormData
async function getFileFromFormData(c: any): Promise<{ buffer: Buffer, originalname: string } | null> {
  try {
    const body = await c.req.parseBody()
    const file = body.file as File
    
    if (!file) return null
    
    const buffer = Buffer.from(await file.arrayBuffer())
    return {
      buffer,
      originalname: file.name
    }
  } catch (error) {
    console.error("Error parsing form data:", error)
    return null
  }
}

// PDF upload and processing
slides.post('/session/:sessionId/slides/pdf', authMiddleware, async (c) => {
  try {
    const sessionId = c.req.param('sessionId')

    // Get file from form data
    const fileData = await getFileFromFormData(c)
    
    if (!fileData) {
      return c.json({ error: "No file uploaded" }, 400)
    }

    const { buffer: pdfBuffer, originalname } = fileData

    // Validate file extension
    const ext = path.extname(originalname).toLowerCase()
    if (ext !== '.pdf' && ext !== '.jpg') {
      return c.json({ error: "Only PDF and JPG files are allowed" }, 400)
    }

    console.log("File received, processing PDF")
    console.log("PDF buffer size:", pdfBuffer.length)

    // Convert PDF to images
    const images: Buffer[] | null = await pdftopic.pdftobuffer(pdfBuffer, "all")
    
    if (!images || images.length === 0) {
      return c.json({ error: "Failed to process PDF into images" }, 500)
    }

    console.log(`PDF processed into ${images.length} images`)

    // Upload images to Supabase
    const uploadPromises = images.map(async (imageBuffer, index) => {
      const fileName = `session/${sessionId}/page-${index + 1}.png`
      
      try {
        // Upload image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, imageBuffer, {
            contentType: "image/png",
            upsert: true
          })

        if (uploadError) {
          console.error(`Failed to upload image ${index + 1}:`, uploadError)
          return null
        }

        // Get public URL for the uploaded image
        const { data: publicData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName)

        // Store slide info in database
        await prisma.slide.create({
          data: {
            type: "image",
            imageUrl: publicData.publicUrl,
            sessionId: sessionId
          }
        })

        return publicData.publicUrl
      } catch (uploadError) {
        console.error(`Error uploading image ${index + 1}:`, uploadError)
        return null
      }
    })

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises)
    const validUrls = uploadedUrls.filter((url: any) => url)

    // Respond with uploaded image URLs
    return c.json({
      message: "PDF processed successfully",
      totalPages: images.length,
      imageUrls: validUrls
    }, 200)

  } catch (error) {
    console.error("Error processing PDF upload:", error)
    return c.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, 500)
  }
})

// Get slides for a session
slides.get('/session/:sessionId/slides', authMiddleware, async (c) => {
  try {
    const sessionId = c.req.param('sessionId')

    const sessionSlides = await prisma.slide.findMany({
      where: {
        sessionId: sessionId
      },
      orderBy: {
        id: 'asc'
      }
    })

    return c.json({
      slides: sessionSlides
    }, 200)

  } catch (error) {
    console.error("Error fetching slides:", error)
    return c.json({ error: "Internal server error" }, 500)
  }
})

export default slides