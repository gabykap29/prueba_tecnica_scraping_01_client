# Rappi Analytics Web - Technical Documentation

## Demo - Video de demostración

Mira el video de funcionamiento de la interfaz conversacional:

<details>
<summary>Ver video demo</summary>

https://github.com/user-attachments/files/video-demo.mp4

</details>

O descarga directamente: [video-demo.mp4](files/video-demo.mp4)

---

## Overview

Rappi Analytics Web is a modern Next.js dashboard for visualizing and analyzing food delivery price comparisons across multiple platforms (Uber Eats, Rappi, Didi Food).

## Architecture

```
rappi-analytics-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout with navigation
│   │   ├── page.tsx        # Main dashboard page
│   │   └── globals.css     # Global styles
│   │
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   │   └── index.tsx  # Button, Card, Input, Select, Spinner, etc.
│   │   │
│   │   └── features/      # Feature-specific components
│   │       ├── CompareSection.tsx     # Price comparison
│   │       ├── RankingsSection.tsx # Platform rankings
│   │       ├── PricesSection.tsx   # Price analytics
│   │       ├── ETAsSection.tsx     # Delivery times
│   │       └── TrendsSection.tsx   # Price trends
│   │
│   ├── services/           # Service layer (API calls)
│   │   ├── analytics.ts   # API client for backend
│   │   ├── export.ts    # Export utilities (JSON, CSV, Excel)
│   │   └── index.ts     # Service exports
│   │
│   ├── hooks/            # Custom React hooks
│   │   └── useAnalytics.ts  # Data fetching hooks
│   │
│   ├── types/            # TypeScript type definitions
│   │   └── api.ts       # API response types
│   │
│   └── lib/             # Utility functions
│       └── utils.ts     # Formatting helpers
│
├── package.json          # Dependencies
├── tailwind.config.ts    # Tailwind CSS config
└── tsconfig.json     # TypeScript config
```

## Features

### 1. Price Comparison
- Search product prices across all platforms
- Filter by zone (high, mid, periphery)
- Visual comparison with best option highlighted
- Export to JSON, CSV, or Excel

### 2. Rankings
- Rank platforms by metric (price, ETA, delivery fee)
- Filter by zone type
- Configurable result limit (1-100)

### 3. Price Analytics
- Average delivery fee statistics
- Average ETA by zone
- Total records count
- Top promotions by platform

### 4. Delivery Times
- ETA comparison by restaurant
- Min/max/average times per platform

### 5. Trends
- Historical price tracking
- Configurable date range (7, 14, 30 days)
- Multi-platform comparison table

## API Service Layer

### analytics.ts
Provides methods to interact with the backend API:

```typescript
analyticsService.checkHealth()
analyticsService.comparePrices(product, zone, startDate, endDate)
analyticsService.getRankings(metric, zoneType, limit)
analyticsService.getPrices(zoneType, startDate, endDate, restaurant)
analyticsService.getETAs(restaurant, zone)
analyticsService.getTrends(product, zone, days)
```

### export.ts
Handles data export in multiple formats:

```typescript
exportData(data, filename, 'json')  // JSON format
exportData(data, filename, 'csv')  // CSV format
exportData(data, filename, 'xlsx') // Excel format
```

## Custom Hooks

### useAnalytics.ts
- `useComparePrices()` - Fetches price comparisons
- `useRankings()` - Fetches platform rankings
- `usePrices()` - Fetches price analytics
- `useETAs()` - Fetches delivery time data
- `useTrends()` - Fetches trend data
- `useHealth()` - Checks API health status

## UI Components

| Component | Description |
|-----------|-------------|
| Badge | Status indicator (success, warning, error) |
| Card | Container with header/content sections |
| Button | Primary, secondary, outline, ghost variants |
| Input | Text input with optional label |
| Select | Dropdown with options |
| Spinner | Loading spinner (sm, md, lg) |
| Loading | Loading state with text |
| EmptyState | Empty data placeholder |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://127.0.0.1:8000 |

## Getting API Keys

### SerpAPI (for OSINT search)

Used for fallback search when scraping fails.

1. **Sign up** at: https://serpapi.com
2. Sign in with **GitHub** or **Google**
3. Verify **email** and **phone**
4. Choose **Free** plan (100 searches/month) or paid
5. Go to **Manage API Key** in dashboard
6. Copy your API key

**Free**: 250 searches/month (U.S. Legal Shield, ZeroTrace Mode)
**Paid**: From $75/month for more searches

### Google Gemini API (for AI agent)

Used for conversational AI agent.

1. **Sign up** at: https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key

**Free** (with limits): 15 requests/min, 1M tokens/day
**Paid**: $0.35-$0.50 per 1M tokens

## Installation

```bash
cd rappi-analytics-web
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Export**: xlsx, file-saver
- **Icons**: Lucide React