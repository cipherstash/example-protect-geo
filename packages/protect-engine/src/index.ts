import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { protect, csTable, csColumn } from '@cipherstash/protect'

const table = csTable('test', {
  item: csColumn('item').equality(),
})

const protectEngine = await protect({
  schemas: [table],
})

const app = new Hono()

app.get('/encrypt', async (c) => {
  const item = c.req.query('item')

  if (!item) {
    return c.json({ error: 'Item is required' }, 400)
  }

  const encryptedItem = await protectEngine.encrypt(item, {
    table,
    column: table.item,
  })

  if (encryptedItem.failure) {
    return c.json({ error: 'Failed to encrypt item' }, 500)
  }

  return c.json({ encryptedItem: encryptedItem.data })
})

export const serveProtectEngine = (port: number) =>
  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`)
    },
  )
