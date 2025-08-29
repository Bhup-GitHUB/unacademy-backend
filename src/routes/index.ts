import { Hono } from 'hono'
import auth from './auth'
import sessions from './session'
import slides from './slides'

const app = new Hono()

// Health check
app.get('/ping', (c) => {
  return c.text('Pong')
})

// Mount route handlers
app.route('/', auth)      // /api/v1/signup, /api/v1/signin
app.route('/', sessions)  // /api/v1/session routes
app.route('/', slides)    // /api/v1/session/:id/slides routes

export default app