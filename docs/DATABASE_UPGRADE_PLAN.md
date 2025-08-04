# Database Upgrade Plan: SQLite → PostgreSQL

## Why Upgrade to PostgreSQL?

### Current Issues with SQLite:
- **No full-text search** (customers can't search venues/packages easily)
- **Limited concurrent users** (weddings book fast, you need multiple users)
- **No advanced indexing** (slow quote searches as data grows)
- **No JSON operations** (can't store flexible wedding preferences)
- **No geographic queries** (can't find venues by distance)

### PostgreSQL Benefits for Wedding Business:
- **Full-text search** → customers find packages/venues instantly
- **Concurrent bookings** → multiple couples can browse simultaneously  
- **Advanced indexing** → lightning-fast quote/availability searches
- **JSON support** → flexible wedding customizations
- **PostGIS extension** → venue distance calculations
- **Better analytics** → wedding trends, popular packages

## Implementation Plan

### Phase 1: Setup PostgreSQL (Production-Ready)
```bash
# 1. Install PostgreSQL locally
brew install postgresql@15
brew services start postgresql@15

# 2. Create database
createdb bv_studios_wedding_db

# 3. Update environment
DATABASE_URL="postgresql://username:password@localhost:5432/bv_studios_wedding_db"
```

### Phase 2: Schema Migration
```prisma
// Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add performance indexes
model WeddingQuote {
  // ... existing fields
  @@index([eventDate])
  @@index([status, createdAt])
  @@index([userId, status])
  @@fulltext([specialRequests])
}

model Venue {
  // ... existing fields
  @@fulltext([name, description, city])
}
```

### Phase 3: Data Migration
```bash
# Export SQLite data
sqlite3 prisma/dev.db ".dump" > backup.sql

# Convert to PostgreSQL format
# Import to PostgreSQL
psql bv_studios_wedding_db < converted_backup.sql

# Re-seed with Prisma
npx prisma db push
npm run seed
```

## Performance Improvements Expected

| Feature | SQLite (Current) | PostgreSQL |
|---------|------------------|------------|
| Concurrent Users | 1-2 | 100+ |
| Search Speed | Slow LIKE queries | Instant full-text |
| Quote Lookup | 200ms+ | <50ms |
| Venue Search | No distance calc | Geographic search |
| Wedding Analytics | Basic | Advanced reporting |

## Cost: FREE for your current scale