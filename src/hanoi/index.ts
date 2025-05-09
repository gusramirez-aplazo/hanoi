import { Hono } from 'hono'
import customLogger from '../logger/custom.js'
import { solveWithTiming } from './solve.js'
import { validateDisks } from './valid-disks.middleware.js'

const app = new Hono()
const originDefaultName = 'Origin'
const destinyDefaultName = 'Destiny'
const helperDefaultName = 'Helper'

app.post('/', validateDisks(), async (c) => {
  const payload = await c.req.json()

  const {
    disks,
    origin = originDefaultName,
    destiny = destinyDefaultName,
    helper = helperDefaultName,
  } = payload ?? {}

  const result = await solveWithTiming({
    disks,
    origin,
    helper,
    destiny,
  })

  customLogger(
    'Hanoi solution: ',
    result.totalMoves.toString(),
    result.time.toString()
  )

  return c.json({
    data: result,
    ok: true,
    error: null,
  })
})

export default app
