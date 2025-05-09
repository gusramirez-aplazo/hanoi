import { createMiddleware } from 'hono/factory'

const validateDisks = () =>
  createMiddleware(async (c, next) => {
    const payload = await c.req.json()

    const { disks } = payload ?? {}

    if (disks == null) {
      return c.json(
        {
          data: null,
          ok: false,
          error: 'disks is required',
        },
        400
      )
    }

    if (typeof disks !== 'number') {
      return c.json(
        {
          data: null,
          ok: false,
          error: 'disks must be a number',
        },
        400
      )
    }

    if (disks < 1) {
      return c.json(
        {
          data: null,
          ok: false,
          error: 'disks must be greater than 0',
        },
        400
      )
    }

    if (!Number.isInteger(disks)) {
      return c.json(
        {
          data: null,
          ok: false,
          error: 'disks must be an integer',
        },
        400
      )
    }

    if (!Number.isFinite(disks)) {
      return c.json(
        {
          data: null,
          ok: false,
          error: 'disks must be a finite number',
        },
        400
      )
    }

    await next()
  })

export { validateDisks }
