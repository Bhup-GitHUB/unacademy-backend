import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Route imports
import authRoutes from './routes/auth'
import sessionRoutes from './routes/sessions'


type Bindings = {
  DB: D1Database
  SESSIONS: KVNamespace
  UPLOADS: R2Bucket
  JWT_SECRET: string
  SUPABASE_URL?: string
  SUPABASE_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()


app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://your-frontend-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))


app.get('/', (c) => {
  return c.json({
    message: '🎓 Unacademy-like Backend API',
    version: '1.0.0',
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth/*',
      sessions: '/api/v1/sessions/*'
    }
  })
})

app.get('/api/v1/health', (c) => {
  return c.json({
    status: 'healthy',
    message: 'API is running smoothly',
    timestamp: new Date().toISOString(),
    worker_location: c.req.cf?.colo || 'unknown'
  })
})


app.route('/api/v1/auth', authRoutes)
app.route('/api/v1/sessions', sessionRoutes)


app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found',
    path: c.req.path
  }, 404)
})


app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    success: false,
    message: 'Internal server error',
    error: err.message
  }, 500)
})

export default app