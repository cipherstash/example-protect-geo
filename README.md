# CipherStash ZeroKMS Geo-Protection Demo

This application demonstrates the power of **CipherStash ZeroKMS capabilities** by routing sensitive data to different protect servers configured for specific ZeroKMS regions based on the user's geographic location. Each country's data is encrypted using region-specific ZeroKMS workspaces, ensuring data sovereignty and compliance with local regulations.

## 🌍 Key Benefits Demonstrated

- **Data Sovereignty**: Each country's data is encrypted using region-specific ZeroKMS workspaces
- **Compliance**: Meets regional data protection requirements (GDPR, CCPA, etc.)
- **ZeroKMS Composability**: Different encryption keys and ZeroKMS regions per country
- **Fault Isolation**: Issues in one ZeroKMS region don't affect others
- **Scalability**: Each ZeroKMS region can scale independently

## 🏗️ Architecture

```
User Request → API (Geo-Detection) → Country-Specific Protect Server → ZeroKMS Region-Specific Encryption
```

### Current ZeroKMS Regions
- **US**: `protect-server-usa.railway.internal` (configured for US ZeroKMS workspace)
- **AU**: `protect-server-au.railway.internal` (configured for AU ZeroKMS workspace)
- **Local Development**: `localhost` (configured for local ZeroKMS workspace)

## 🚀 Adding New ZeroKMS Regions/Countries

Adding a new ZeroKMS region is incredibly simple with CipherStash ZeroKMS composability:

### 1. Create a New ZeroKMS Workspace
Create a new CipherStash workspace in your target region (e.g., EU, Asia, etc.)

### 2. Deploy a New Protect Server
Deploy a new protect server (can be in the same infrastructure) configured with the new ZeroKMS workspace:

```bash
# Example for AU ZeroKMS region
CS_WORKSPACE_CRN=crn:ap-southeast-2.aws:workspace_id
...
```

### 3. Update Country Mapping
Add your new region to the country mapping in `apps/api/src/index.ts`:

```typescript
const countryMap = {
  US: 'protect-server-usa.railway.internal',
  AU: 'protect-server-au.railway.internal',
  EU: 'protect-server-eu.railway.internal',  // ← Just add this line!
  // Add as many ZeroKMS regions as needed...
}
```

### 4. Deploy and Test
That's it! Your new ZeroKMS region is now live and will automatically route users from that country to the appropriate ZeroKMS workspace.

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
    "dataSovereignty": "Data encrypted using US ZeroKMS workspace",
    "compliance": "Meets US data protection requirements", 
    "zeroKMSComposability": "Encrypted with US-specific ZeroKMS keys",
    "faultIsolation": "Independent ZeroKMS region for US",
    "scalability": "ZeroKMS region-specific scaling for US"
  },
  "routing": {
    "detectedCountry": "US",
    "protectServer": "protect-server-usa.railway.internal",
    "zeroKMSRegion": "US ZeroKMS Workspace"
  },
  "encryption": {
    "originalItem": "your-sensitive-data",
    "encryptedItem": "encrypted-data-here",
    "zeroKMSRegion": "US"
  }
}
```

## 🎯 Perfect for Demos

This application is designed to showcase:
- How easy it is to add new ZeroKMS regions (just 1 line of code!)
- The power of CipherStash ZeroKMS composability with region-specific workspaces
- Real-world data sovereignty and compliance benefits
- Seamless user experience across different ZeroKMS regions

## 📁 Project Structure

```
├── apps/
│   ├── api/                    # Main API with geo-routing
│   └── protect-server/         # Protect server implementation
├── packages/
│   └── protect-engine/         # CipherStash integration
└── README.md                   # This file
```
