import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import routes from './routes/index'

const app = new Hono()
const PORT = 3000

app.use('*', logger())
app.use('*', cors())

app.route('/api/v1', routes)


app.get('/', (c) => {
  return c.text('Hono Presentation Server is running!')
})

console.log(`Server is running on port ${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT,
})