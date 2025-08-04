# Advanced Search Implementation for Wedding Booking

## Why Your Customers Need Better Search

### Current Search Problems:
- No search on wedding packages (customers can't find what they want)
- No venue filtering by style/location/capacity
- No "smart suggestions" for package combinations
- Admin can't search quotes/customers efficiently

### Search Implementation Options:

## Option 1: Algolia (RECOMMENDED) ⭐⭐⭐
**Professional search used by major wedding sites**

### Features You'll Get:
- **Instant search** as customer types
- **Smart filters** (price, style, location, capacity)
- **Typo tolerance** ("beachside" finds "beach side")
- **Faceted search** (filter by multiple criteria)
- **Analytics** (what customers search for most)

### Implementation:
```bash
npm install algoliasearch react-instantsearch-hooks-web
```

```javascript
// lib/algolia.js
import algoliasearch from 'algoliasearch'

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
)

// Index wedding packages
export const packageIndex = client.initIndex('wedding_packages')
export const venueIndex = client.initIndex('wedding_venues')

// Sync data to Algolia
export async function syncPackages() {
  const packages = await prisma.weddingPackage.findMany()
  await packageIndex.saveObjects(packages, { autoGenerateObjectIDIfNotExist: true })
}
```

### Search Components:
```jsx
// components/wedding/PackageSearch.jsx
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-hooks-web'

export default function PackageSearch() {
  return (
    <InstantSearch searchClient={client} indexName="wedding_packages">
      <SearchBox placeholder="Search wedding packages..." />
      <Hits hitComponent={PackageHit} />
    </InstantSearch>
  )
}
```

**Cost: FREE up to 10K searches/month** (perfect for your scale)

## Option 2: PostgreSQL Full-Text (FREE Alternative) ⭐⭐

### If staying with simpler solution:
```sql
-- Add search indexes to PostgreSQL
CREATE INDEX wedding_package_search_idx ON "WeddingPackage" 
USING gin(to_tsvector('english', name || ' ' || description));

CREATE INDEX venue_search_idx ON "Venue" 
USING gin(to_tsvector('english', name || ' ' || description || ' ' || city));
```

```javascript
// Search implementation
export async function searchPackages(query) {
  return await prisma.$queryRaw`
    SELECT *, ts_rank(to_tsvector('english', name || ' ' || description), 
                      plainto_tsquery('english', ${query})) as rank
    FROM "WeddingPackage"
    WHERE to_tsvector('english', name || ' ' || description) 
          @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
  `
}
```

## Search Features You Can Add:

### 1. Smart Package Finder
- "Beach wedding under $3000" → finds Silver + specific addons
- "All-day coverage with drone" → finds Gold/Diamond + drone addon
- "Small intimate ceremony" → filters by guest count + package size

### 2. Venue Discovery
- "Outdoor venues in Lexington" → geographic + style filters
- "Venues for 100+ guests" → capacity filtering
- "Historic venues with gardens" → style + feature combinations

### 3. Admin Search Dashboard
- Find quotes by customer name, date, venue
- Search all customers and their booking history
- Find popular package combinations

## Expected Impact:

| Feature | Before | After |
|---------|--------|-------|
| Package Discovery | Browse all 3 | Find perfect match in seconds |
| Venue Selection | Scroll through 5 | Filter by exact needs |
| Quote Management | Manual lookup | Instant search |
| Customer Satisfaction | Good | Exceptional |

**Bottom Line: Search converts browsers into bookers** 🎯