import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const countryMap = {
  US: 'protect-server-usa.railway.internal',
  AU: 'protect-server-au.railway.internal',
}

const app = new Hono()

app.get('/', async (c) => {
  const geoCountry = c.req.header('CF-IPCountry')
  const item = c.req.query('item')

  const protectServer = geoCountry
    ? countryMap[geoCountry as keyof typeof countryMap] || countryMap.US
    : 'localhost'

  const protectedItem = await fetch(
    `http://${protectServer}:3001/encrypt?item=${item}`,
  )

  if (!protectedItem.ok) {
    return c.json({ error: 'Failed to encrypt item' }, 500)
  }

  const protectedItemData = await protectedItem.json()

  return c.json({
    message: 'Hello World',
    geoCountry: geoCountry || 'local development',
    item,
    encrypted: protectedItemData.encryptedItem,
  })
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
