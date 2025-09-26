import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

const countryMap = {
  US: 'protect-server-usa.railway.internal',
  AU: 'protect-server-au.railway.internal',
}

const app = new Hono()

if (process.env.NODE_ENV === 'production') {
  app.use(
    '/auth/*',
    basicAuth({
      username: 'cipherstash',
      password: `${process.env.CIPHERSTASH_PASSWORD}`,
    }),
  )
}

app.get('/', async (c) => {
  const geoCountry = c.req.header('CF-IPCountry')
  const item = c.req.query('item')

  if (!item) {
    return c.json({ error: 'Item query parameter is required' }, 400)
  }

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
    message: 'CipherStash ZeroKMS Geo-Protection Demo',
    benefits: {
      dataSovereignty: `Data encrypted using ${geoCountry || 'local'} ZeroKMS workspace`,
      compliance: `Meets ${geoCountry || 'local'} data protection requirements`,
      zeroKMSComposability: `Encrypted with ${geoCountry || 'local'}-specific ZeroKMS keys`,
      faultIsolation: `Independent ZeroKMS region for ${geoCountry || 'local'}`,
      scalability: `ZeroKMS region-specific scaling for ${geoCountry || 'local'}`,
    },
    routing: {
      detectedCountry: geoCountry || 'local development',
      protectServer: protectServer,
      zeroKMSRegion: geoCountry
        ? `${geoCountry} ZeroKMS Workspace`
        : 'Local ZeroKMS Workspace',
    },
    encryption: {
      originalItem: item,
      encryptedItem: protectedItemData.encryptedItem,
      zeroKMSRegion: geoCountry || 'local',
    },
    demo: {
      message:
        'This demonstrates how CipherStash ZeroKMS enables data sovereignty through region-specific workspaces',
      nextSteps:
        'Try changing your location to see different ZeroKMS region routing!',
    },
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
