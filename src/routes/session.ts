import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

// Define context type for authenticated routes
type AuthenticatedContext = {
  Variables: {
    user: {
      userId: string
    }
  }
}

const sessions = new Hono<AuthenticatedContext>()
const prisma = new PrismaClient()

// Create session
sessions.post('/session', authMiddleware, async (c) => {
  try {
    const body = await c.req.json()
    const { title } = body
    const user = c.get('user')
    const userId = user.userId

    const session = await prisma.liveSession.create({
      data: {
        title: title,
        userId: userId,
      },
    })

    return c.json({
      sessionId: session.id,
    }, 200)

  } catch (error) {
    console.error("Error creating session:", error)
    return c.json({
      error: "Internal server error",
    }, 500)
  }
})

// Get all sessions
sessions.get('/sessionsResponse', authMiddleware, async (c) => {
  try {
    const sessions = await prisma.liveSession.findMany()
    const sessionJson = sessions.map((item: any) => {
      return {
        sessionId: item.id,
        title: item.title,
        startTime: item.startTime,
        status: item.status,
      }
    })
    
    return c.json(sessionJson, 200)
    
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return c.json({ error: "Internal server error" }, 500)
  }
})

// Start session
sessions.post('/session/:sessionId/start', authMiddleware, async (c) => {
  try {
    const sessionId = c.req.param('sessionId')
    
    const sessionExist = await prisma.liveSession.findFirst({
      where: {
        id: sessionId,
      },
    })

    if (!sessionExist) {
      return c.json({
        msg: "Session does not exist",
      }, 404)
    }

    if (sessionExist.startTime) {
      return c.json({
        msg: "Session already started",
      }, 400)
    }

    const currentTime = new Date().toISOString()

    const session = await prisma.liveSession.update({
      where: {
        id: sessionId,
      },
      data: {
        startTime: currentTime,
        status: "active",
      },
    })

    return c.json({
      message: "Session started successfully",
    }, 200)

  } catch (error) {
    console.error("Error starting session:", error)
    return c.json({
      msg: "Internal Server Error",
    }, 500)
  }
})

// End session
sessions.post('/session/:sessionId/end', authMiddleware, async (c) => {
  try {
    const sessionId = c.req.param('sessionId')
    
    const sessionExist = await prisma.liveSession.findFirst({
      where: {
        id: sessionId,
      },
    })

    if (!sessionExist) {
      return c.json({
        msg: "Session does not exist",
      }, 404)
    }

    if (!sessionExist.startTime) {
      return c.json({
        msg: "Session not started yet",
      }, 400)
    }

    await prisma.liveSession.update({
      where: {
        id: sessionId,
      },
      data: {
        status: "inactive",
      },
    })

    return c.json({
      message: "Session ended successfully",
    }, 200)

  } catch (error) {
    console.error("Error ending session:", error)
    return c.json({
      msg: "Internal Server Error",
    }, 500)
  }
})

export default sessions