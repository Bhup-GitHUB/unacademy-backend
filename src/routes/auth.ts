import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import z from 'zod'
import { userSignupInputSchema, userSignInInputSchema } from '../middleware/utils/inputParser'
import { generateToken } from '../middleware/utils/jwt'

const auth = new Hono()
const prisma = new PrismaClient()

// Signup route
auth.post('/signup', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password, username } = body

    const payloadParse = userSignupInputSchema.parse({
      username,
      email,
      password,
    })

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return c.json({
        message: "Email or username already exists",
      }, 409)
    }

    const hashedPassword = await bcrypt.hashSync(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })

    return c.json({
      message: "User successfully registered",
      userId: newUser.id,
      username: newUser.username,
    }, 201)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        message: "Validation errors",
        errors: error.errors,
      }, 400)
    }

    console.error("Error during signup:", error)
    return c.json({
      message: "Internal server error",
    }, 500)
  }
})

// Signin route
auth.post('/signin', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = body

    const payloadParse = userSignInInputSchema.parse({ email, password })

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!existingUser) {
      return c.json({
        msg: "User not found",
      }, 401)
    }

    const hashedPassword = existingUser?.password
    const isValidPassword = await bcrypt.compare(
      password,
      hashedPassword as string
    )

    if (!isValidPassword) {
      return c.json({ msg: "Incorrect password" }, 400)
    }

    const token = generateToken(existingUser.id)

    return c.json({
      token: token,
      userId: existingUser.id,
    }, 200)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        message: "Validation errors",
        errors: error.errors,
      }, 400)
    }

    console.error("Error during signin:", error)
    return c.json({
      message: "Internal server error",
    }, 500)
  }
})

export default auth