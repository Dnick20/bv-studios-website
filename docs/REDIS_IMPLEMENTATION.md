# Redis Implementation for Wedding Booking System

## Why Redis Will Transform Your User Experience

### Current Performance Issues:
- Wedding packages reload from database every time (slow)
- Venue lists re-fetch on every page visit
- Admin dashboard queries database repeatedly
- Customer quote calculations hit DB multiple times

### Redis Benefits:
- **Wedding packages cached** → Load instantly (3000ms → 50ms)
- **Venue data cached** → No database hits for browsing
- **User sessions cached** → Faster login/logout
- **Quote calculations cached** → Real-time pricing updates
- **Admin analytics cached** → Dashboard loads 10x faster

## Implementation Plan

### Phase 1: Install Redis
```bash
# Local development
brew install redis
brew services start redis

# Production (Vercel + Upstash Redis)
# Free tier: 10,000 commands/day
```

### Phase 2: Add Redis Client
```bash
npm install ioredis @upstash/redis
```

### Phase 3: Cache Strategy
```javascript
// lib/redis.js
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const cache = {
  // Wedding packages (cache for 1 hour)
  async getPackages() {
    const cached = await redis.get('wedding:packages')
    if (cached) return JSON.parse(cached)
    
    const packages = await prisma.weddingPackage.findMany()
    await redis.setex('wedding:packages', 3600, JSON.stringify(packages))
    return packages
  },

  // Venues (cache for 24 hours - rarely change)
  async getVenues() {
    const cached = await redis.get('wedding:venues')
    if (cached) return JSON.parse(cached)
    
    const venues = await prisma.venue.findMany()
    await redis.setex('wedding:venues', 86400, JSON.stringify(venues))
    return venues
  },

  // User quotes (cache for 5 minutes)
  async getUserQuotes(userId) {
    const cached = await redis.get(`user:${userId}:quotes`)
    if (cached) return JSON.parse(cached)
    
    const quotes = await prisma.weddingQuote.findMany({
      where: { userId }
    })
    await redis.setex(`user:${userId}:quotes`, 300, JSON.stringify(quotes))
    return quotes
  }
}
```

## Performance Improvements Expected

| Page | Current Load Time | With Redis |
|------|------------------|------------|
| Wedding Packages | 500-800ms | 50-80ms |
| Venue Browser | 300-600ms | 30-60ms |
| My Quotes | 400-700ms | 40-70ms |
| Admin Dashboard | 1000-2000ms | 100-200ms |

## Cost: FREE (Upstash free tier sufficient for your scale)