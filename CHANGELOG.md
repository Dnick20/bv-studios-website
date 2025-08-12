# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2024-12-19

### 🚨 **Critical API Fixes for Vercel Deployment**

#### **Breaking Changes**

- **Removed entire `pages/` directory** to eliminate duplicate page conflicts with App Router
- **Migrated from NextAuth v4 to NextAuth v5 beta** (`^5.0.0-beta.29`)
- **Replaced `getServerSession()` with `auth()` function** throughout all API routes

#### **API Route Updates**

- **Created centralized auth configuration** in `lib/auth.js`
- **Updated all API routes** to use `import { auth } from '@/lib/auth'` instead of `getServerSession`
- **Fixed import paths** from relative paths to absolute imports using `@` alias
- `app/api/wedding/packages/route.js`: normalized price units (cents), provided JSON string features, added `packages` key to response
- `app/api/wedding/packages/route.js`: align package names with Weddings page (Silver/Gold/Diamond), keep booking prices as source of truth
- `app/weddings/page.js`: load packages from `/api/wedding/packages` to ensure same data and numbers as booking
- `app/api/wedding/addons/route.js`: normalized price units (cents), added `addons` key to response
- `app/api/wedding/venues/route.js`: verified endpoint used by booking page
- `lib/bots/handlers/WeddingDataBot.js`: new bot to seed/sync wedding packages, addons, and venues via Prisma
- `lib/bots/core/BotManager.js`: helper to register `wedding-data` bot
- `app/api/admin/wedding-data/sync/route.js`: admin-only endpoint to trigger WeddingDataBot (auth via NextAuth admin or `x-admin-token`)
- `app/admin/dashboard/page.js`: added "Sync Wedding Data" button under Bots tab

#### **Files Modified**

- `app/api/activity/route.js` - Updated auth import
- `app/api/admin/wedding-quotes/route.js` - Updated auth import and formatting
- `app/api/payment/create-intent/route.js` - Updated auth import and formatting
- `app/api/wedding/reviews/submit/route.js` - Updated auth import
- `app/api/wedding/analytics/dashboard/route.js` - Updated auth import
- `app/api/reports/route.js` - Updated auth import
- `app/api/wedding/payment/create-intent/route.js` - Updated auth import
- `app/api/wedding/notifications/send-email/route.js` - Updated auth import
- `app/api/wedding/notifications/send-sms/route.js` - Updated auth import
- `app/api/wedding/calendar/availability/route.js` - Updated auth import
- `app/api/wedding/quotes/route.js` - Updated auth import
- `app/api/projects/route.js` - Updated auth import
- `app/api/projects/[id]/route.js` - Updated auth import
- `app/api/wedding/notifications/send-push/route.js` - Fixed variable name conflict
- `app/api/debug/route.js` - Updated auth import
- `app/api/auth/[...nextauth]/route.js` - Simplified to re-export from lib/auth.js

#### **New Files Created**

- `lib/auth.js` - Centralized NextAuth v5 configuration with credentials provider

#### **Issues Resolved**

- ✅ **Duplicate page conflicts** between `pages/` and `app/` directories
- ✅ **500 errors** on `/auth` routes
- ✅ **Import errors** for `getServerSession` function
- ✅ **Module resolution errors** for auth imports
- ✅ **Variable name conflicts** in notification routes
- ✅ **Build failures** preventing Vercel deployment
- ✅ Wedding booking page stuck on "Loading wedding packages..." (response shape mismatch)
- ✅ Addons prices off by 100x (dollars vs cents)

#### **Technical Details**

- **NextAuth v5 Migration**:
  - Uses `export const { auth, handlers: { GET, POST } } = NextAuth(...)`
  - Replaced deprecated `getServerSession()` with `auth()` function
  - Updated session callbacks for JWT strategy
- **App Router Standardization**:
  - Removed legacy `pages/` directory completely
  - Standardized on modern Next.js 15 App Router architecture
- **Import Path Resolution**:
  - Changed from relative imports (`../../../../lib/auth`) to absolute imports (`@/lib/auth`)
  - Updated `tsconfig.json` or `jsconfig.json` to support `@` alias
- **Wedding Booking Data Contract**:
  - Booking UI expects `packages`, `addons`, `venues` properties
  - Price values are cents and displayed via `(price / 100).toLocaleString()`
  - `features` provided as JSON string array for resilient parsing
  - Time windows on booking page now adapt to selected package duration (4h/8h/12h)
  - Booking page theme aligned with Weddings page and uses wedding hero background

#### **Deployment Notes**

- **Prerequisites**: Ensure `.env` file contains required environment variables
- **Build Command**: `npm run build` (includes `prisma generate`)
- **Runtime**: Next.js 15.4.5 with Turbopack support
- **Database**: Prisma with PostgreSQL (requires `prisma generate` before build)

#### **Prevention Measures**

- **Never mix `pages/` and `app/` directories** for the same routes
- **Use NextAuth v5 patterns** when upgrading from v4
- **Centralize auth configuration** in a single file
- **Use absolute imports** with proper alias configuration
- **Test API routes** after auth system changes
- **Run `npm run build`** locally before deployment to catch conflicts

---

## [Previous Versions]

_Note: This changelog was created to document the critical API fixes made on 2024-12-19. Previous version history was not maintained._
