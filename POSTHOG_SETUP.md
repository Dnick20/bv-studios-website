# 🚀 PostHog Analytics Setup Guide

## ✅ **Your PostHog Credentials**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_Xac1uB8VGG5UmOl5E2NMwPrOIsZ8r3m5Ov2OCCi2YSk
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## 📝 **Step 1: Create Environment File**

Create a file called `.env.local` in your project root:

```bash
# PostHog Analytics Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_Xac1uB8VGG5UmOl5E2NMwPrOIsZ8r3m5Ov2OCCi2YSk
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 **Step 2: Start Server with Analytics**

Option A - With .env.local file:
```bash
npm run dev
```

Option B - Direct environment variables:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_Xac1uB8VGG5UmOl5E2NMwPrOIsZ8r3m5Ov2OCCi2YSk NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com npm run dev
```

## 🧪 **Step 3: Test Real Analytics**

1. **Open your website**: http://localhost:3000 (or 3001)
2. **Open browser console** (F12 → Console)
3. **Navigate to wedding booking**: `/wedding-booking`
4. **Interact with the page**:
   - Hover over packages
   - Select packages
   - Add/remove addons
   - Fill out the quote form

## 📊 **Step 4: Verify Analytics in PostHog**

1. **Login to PostHog**: https://us.i.posthog.com
2. **Go to Events**: Look for events like:
   - `Wedding Package Viewed`
   - `Wedding Package Selected`
   - `Wedding Addon Added`
   - `Wedding Quote Submitted`
3. **Real-time tracking**: Events should appear within seconds!

## 🎯 **What You'll See in PostHog**

### **Customer Journey Events:**
- 📄 `Wedding Page View` - When users visit pages
- 👀 `Wedding Package Viewed` - Package hover/focus
- ✅ `Wedding Package Selected` - Package selection
- 🔧 `Wedding Addon Added/Removed` - Customization
- 🏢 `Wedding Venue Viewed/Selected` - Venue choices
- 📝 `Wedding Quote Form Progress` - Form completion
- 🎉 `Wedding Quote Submitted` - Conversion!

### **Business Insights:**
- **Conversion funnels** - Where customers drop off
- **Popular packages** - Which packages get selected most
- **Price sensitivity** - How pricing affects selections
- **Geographic data** - Where customers are located
- **Device/browser data** - Technical optimization insights

## 🔧 **Troubleshooting**

### **If you see console messages like:**
```
📊 PostHog Analytics: Demo mode - using placeholder keys.
📊 Analytics Event: Wedding Package Viewed
```
➡️ **Solution**: Environment variables aren't loaded. Restart server with env vars.

### **If analytics aren't appearing in PostHog:**
1. ✅ Check API key is correct
2. ✅ Verify you're on the right PostHog project
3. ✅ Wait 30-60 seconds for events to appear
4. ✅ Check browser network tab for PostHog requests

## 🎊 **Success Indicators**

✅ **No PostHog errors in browser console**
✅ **Network requests to `us.i.posthog.com`**
✅ **Events appearing in PostHog dashboard**
✅ **Real-time user tracking working**

---

**Your wedding booking system now has enterprise-level analytics! 🚀**