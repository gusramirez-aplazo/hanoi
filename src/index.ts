import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import hanoi from './hanoi/index.js'
import customLogger from './logger/custom.js'

const app = new Hono()

app.use(
  '/api/v1/*',
  cors({
    origin: ['https://hanoi-puzzle.pages.dev/'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
  })
)
app.use(secureHeaders())
app.use(logger(customLogger))

app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/api/v1/hanoi', hanoi)

serve(
  {
    fetch: app.fetch,
    port: process.env.HONO_APP_PORT ? Number(process.env.HONO_APP_PORT) : 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
