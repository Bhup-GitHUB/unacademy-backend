import { Context, Next } from 'hono'
import { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from './utils/jwt'

export interface AuthContext extends Context {
  user?: JwtPayload
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    console.log("Inside auth middleware")
    
    const authHeader = c.req.header('authorization')
    const token = authHeader?.split(' ')[1] || c.req.header('cookie')?.split('Authentication=')[1]?.split(';')[0]
    
    console.log("Token:", token)
    
    if (!token) {
      return c.json({ error: "Unauthorized: No token provided" }, 401)
    }

    const payload = verifyToken(token) as JwtPayload
    console.log("Payload:", payload)
    
    if (!payload) {
      return c.json({ error: "Unauthorized: Invalid token payload" }, 401)
    }

    // Store user in context
    c.set('user', payload)
    await next()
    
  } catch (error) {
    console.error("Authentication error:", error)
    return c.json({ error: "Unauthorized: Invalid or expired token" }, 401)
  }
}