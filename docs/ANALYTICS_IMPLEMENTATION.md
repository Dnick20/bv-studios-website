# Wedding Business Analytics Implementation

## Why Analytics Will Grow Your Business

### Questions You Can't Answer Right Now:
- Which wedding packages do customers view most but not book?
- What's the drop-off point in your booking funnel?
- Which venues are most popular by season?
- What addon combinations sell best?
- How do customers find your site?
- Which price points work best?

### What Analytics Will Tell You:
- **Conversion optimization** → increase bookings 20-40%
- **Package optimization** → adjust pricing based on demand
- **Marketing insights** → focus ad spend on what works
- **Customer journey** → fix friction points
- **Seasonal trends** → plan inventory and pricing

## Implementation Options:

### Option 1: PostHog (RECOMMENDED for Wedding Business) ⭐⭐⭐

**Why PostHog for weddings:**
- **Event tracking** → track every booking step
- **Funnel analysis** → see where customers drop off
- **Cohort analysis** → seasonal booking patterns
- **Feature flags** → test different pricing displays
- **Session recordings** → watch customers struggle/succeed

```bash
npm install posthog-js posthog-node
```

```javascript
// lib/analytics.js
import { PostHog } from 'posthog-node'
import posthog from 'posthog-js'

// Client-side tracking
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com'
})

// Track wedding-specific events
export const trackWeddingEvent = (event, properties = {}) => {
  posthog.capture(event, {
    ...properties,
    $timestamp: new Date().toISOString()
  })
}

// Wedding-specific events to track
export const weddingEvents = {
  packageViewed: (packageName, price) => trackWeddingEvent('Package Viewed', {
    package_name: packageName,
    package_price: price
  }),
  
  venueViewed: (venueName, venueType) => trackWeddingEvent('Venue Viewed', {
    venue_name: venueName,
    venue_type: venueType
  }),
  
  addonAdded: (addonName, price) => trackWeddingEvent('Addon Added', {
    addon_name: addonName,
    addon_price: price
  }),
  
  quoteStarted: () => trackWeddingEvent('Quote Started'),
  
  quoteSubmitted: (totalPrice, packageName) => trackWeddingEvent('Quote Submitted', {
    total_price: totalPrice,
    package_name: packageName
  }),
  
  quotePage: (page) => trackWeddingEvent('Quote Page Viewed', {
    page_number: page
  })
}
```

### Integration in Your Components:
```jsx
// app/wedding-booking/page.js
import { weddingEvents } from '../../lib/analytics'

const handlePackageSelect = (pkg) => {
  setSelectedPackage(pkg)
  weddingEvents.packageViewed(pkg.name, pkg.price) // 📊 Track it!
}

const handleAddonToggle = (addon) => {
  if (!selectedAddons.includes(addon.id)) {
    weddingEvents.addonAdded(addon.name, addon.price) // 📊 Track it!
  }
  // ... rest of logic
}
```

### Business Intelligence Dashboard:
```javascript
// Admin analytics you'll see:
const analyticsQueries = {
  // Most viewed packages
  popularPackages: `
    SELECT package_name, COUNT(*) as views
    FROM events 
    WHERE event = 'Package Viewed'
    GROUP BY package_name
    ORDER BY views DESC
  `,
  
  // Conversion funnel
  conversionFunnel: `
    Funnel: 
    1. Package Viewed: 1000 users
    2. Addon Added: 600 users (60%)
    3. Quote Started: 400 users (40%)
    4. Quote Submitted: 200 users (20%)
  `,
  
  // Revenue analysis
  revenueByPackage: `
    SELECT package_name, AVG(total_price), COUNT(*) as bookings
    FROM events 
    WHERE event = 'Quote Submitted'
    GROUP BY package_name
  `
}
```

**Cost: FREE up to 1M events/month** (sufficient for years of growth)

### Option 2: Google Analytics 4 + Custom Events (FREE) ⭐⭐

```javascript
// lib/gtag.js
export const trackWeddingGoal = (action, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'Wedding_Booking',
      value: value,
      currency: 'USD'
    })
  }
}
```

## Key Metrics to Track:

### 1. Booking Funnel Metrics
- **Package page views** → which packages get attention
- **Quote start rate** → how many begin booking process  
- **Quote completion rate** → how many finish
- **Addon selection patterns** → what sells together

### 2. Customer Behavior
- **Time on package pages** → interest level
- **Venue browsing patterns** → preferences
- **Device usage** → mobile vs desktop booking behavior
- **Geographic patterns** → where customers come from

### 3. Business Intelligence
- **Seasonal trends** → when to run promotions
- **Price sensitivity** → optimal pricing points
- **Marketing attribution** → which ads work
- **Customer lifetime value** → repeat business potential

## Expected Business Impact:

| Metric | Current (Blind) | With Analytics |
|--------|----------------|----------------|
| Conversion Rate | Unknown | Optimize to 25%+ |
| Average Order Value | Unknown | Increase 15-30% |
| Customer Acquisition Cost | Unknown | Reduce 20-40% |
| Seasonal Planning | Guesswork | Data-driven decisions |
| Package Optimization | Assumptions | Customer-validated |

**Bottom Line: Analytics turns your wedding business from guessing to knowing** 📈