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
      dataSovereignty: `Data processed in ${geoCountry || 'local'} infrastructure`,
      compliance: `Meets ${geoCountry || 'local'} data protection requirements`,
      zeroKMSComposability: `Encrypted with ${geoCountry || 'local'}-specific keys`,
      faultIsolation: `Independent infrastructure for ${geoCountry || 'local'} region`,
      scalability: `Region-specific scaling for ${geoCountry || 'local'}`,
    },
    routing: {
      detectedCountry: geoCountry || 'local development',
      protectServer: protectServer,
      infrastructure: geoCountry
        ? `${geoCountry} Railway Infrastructure`
        : 'Local Development',
    },
    encryption: {
      originalItem: item,
      encryptedItem: protectedItemData.encryptedItem,
      encryptionRegion: geoCountry || 'local',
    },
    demo: {
      message:
        'This demonstrates how CipherStash ZeroKMS enables data sovereignty',
      nextSteps:
        'Try changing your location to see different infrastructure routing!',
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
