import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  const geoCountry = c.req.header('CF-IPCountry')

  console.log('Request received from: ', geoCountry)
  return c.json({ message: 'Hello World', geoCountry })
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
