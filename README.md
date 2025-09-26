# CipherStash ZeroKMS Geo-Protection Demo

This application demonstrates the power of **CipherStash ZeroKMS composability** by routing sensitive data to different infrastructure services based on the user's geographic location. Each country's data is processed by infrastructure within that region, ensuring data sovereignty and compliance with local regulations.

## 🌍 Key Benefits Demonstrated

- **Data Sovereignty**: Each country's data is processed by infrastructure within that region
- **Compliance**: Meets regional data protection requirements (GDPR, CCPA, etc.)
- **ZeroKMS Composability**: Different encryption keys and infrastructure per country
- **Fault Isolation**: Issues in one region don't affect others
- **Scalability**: Each region can scale independently

## 🏗️ Architecture

```
User Request → API (Geo-Detection) → Country-Specific Protect Server → CipherStash Encryption
```

### Current Regions
- **US**: `protect-server-usa.railway.internal`
- **AU**: `protect-server-au.railway.internal`
- **Local Development**: `localhost`

## 🚀 Adding New Regions/Countries

Adding a new region is incredibly simple with CipherStash ZeroKMS composability:

### 1. Deploy a New Protect Server
Deploy a new protect server in your target region with region-specific CipherStash environment variables:

```bash
# Example for EU region
CIPHERSTASH_API_KEY=your_eu_api_key
CIPHERSTASH_API_URL=your_eu_api_url
CIPHERSTASH_WORKSPACE_ID=your_eu_workspace_id
```

### 2. Update Country Mapping
Add your new region to the country mapping in `apps/api/src/index.ts`:

```typescript
const countryMap = {
  US: 'protect-server-usa.railway.internal',
  AU: 'protect-server-au.railway.internal',
  EU: 'protect-server-eu.railway.internal',  // ← Just add this line!
  // Add as many regions as needed...
}
```

### 3. Deploy and Test
That's it! Your new region is now live and will automatically route users from that country to the appropriate infrastructure.

## 🔧 Development

### Prerequisites
- Node.js >= 22.11
- pnpm

### Running Locally
```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Or start individual services
pnpm start:api
pnpm start:protect-server
```

### Testing the Demo
1. Start the application: `pnpm dev`
2. Visit: `http://localhost:3000?item=your-sensitive-data`
3. Try different locations using VPN or browser dev tools
4. Observe how the infrastructure routing changes based on location

## 📊 Demo Response Format

The API returns a comprehensive response highlighting the ZeroKMS benefits:

```json
{
  "message": "CipherStash ZeroKMS Geo-Protection Demo",
  "benefits": {
    "dataSovereignty": "Data processed in US infrastructure",
    "compliance": "Meets US data protection requirements", 
    "zeroKMSComposability": "Encrypted with US-specific keys",
    "faultIsolation": "Independent infrastructure for US region",
    "scalability": "Region-specific scaling for US"
  },
  "routing": {
    "detectedCountry": "US",
    "protectServer": "protect-server-usa.railway.internal",
    "infrastructure": "US Railway Infrastructure"
  },
  "encryption": {
    "originalItem": "your-sensitive-data",
    "encryptedItem": "encrypted-data-here",
    "encryptionRegion": "US"
  }
}
```

## 🎯 Perfect for Demos

This application is designed to showcase:
- How easy it is to add new regions (just 1 line of code!)
- The power of CipherStash ZeroKMS composability
- Real-world data sovereignty and compliance benefits
- Seamless user experience across different regions

## 📁 Project Structure

```
├── apps/
│   ├── api/                    # Main API with geo-routing
│   └── protect-server/         # Protect server implementation
├── packages/
│   └── protect-engine/         # CipherStash integration
└── README.md                   # This file
```
