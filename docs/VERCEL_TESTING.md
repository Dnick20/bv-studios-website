# Vercel Testing Guide

Since your BV Studios website is deployed on Vercel, you should test all API endpoints on your live domain, not localhost.

## 🔗 Your Vercel Domain

Your website is deployed at: **https://bv-studios-website.vercel.app**

## 🧪 Testing API Endpoints

### 1. Basic API Test
**URL:** `https://bv-studios-website.vercel.app/api/test`
**Method:** GET
**Expected Response:**
```json
{
  "message": "API is working",
  "timestamp": "2025-07-27T...",
  "method": "GET",
  "url": "/api/test"
}
```

### 2. Database Connection Test
**URL:** `https://bv-studios-website.vercel.app/api/test-db`
**Method:** GET
**Expected Response:**
```json
{
  "message": "Database connection successful",
  "timestamp": "2025-07-27T...",
  "test": [{"test": 1}]
}
```

### 3. Registration API Test
**URL:** `https://bv-studios-website.vercel.app/api/auth/register`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## 🎯 Testing Your Registration Form

### ✅ Correct Way:
1. Go to: `https://bv-studios-website.vercel.app/auth/signup`
2. Fill out the registration form
3. Submit the form
4. Check for proper error messages or success

### ❌ Don't Use:
- `localhost:3000` (local development only)
- Any localhost URLs

## 🔧 Environment Variables on Vercel

Make sure these are set in your Vercel dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `bv-studios-website` project
3. Go to Settings > Environment Variables
4. Add/update these variables:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="https://bv-studios-website.vercel.app"
NEXTAUTH_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 🚀 Deployment Status

Your latest changes are automatically deployed when you push to GitHub:

```bash
# Your changes are automatically deployed
git push origin main
# ↓
# Vercel automatically builds and deploys
# ↓
# Available at: https://bv-studios-website.vercel.app
```

## 📊 Monitoring

### Check Deployment Status:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Check the "Deployments" tab
4. Look for any build errors

### View Logs:
1. In Vercel Dashboard, go to your project
2. Click on the latest deployment
3. Check "Functions" tab for API logs
4. Look for any errors in the registration API

## 🐛 Troubleshooting

### If Registration Still Fails:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard > Your Project > Functions
   - Look for `/api/auth/register` function logs
   - Check for database connection errors

2. **Test Database Connection:**
   - Visit: `https://bv-studios-website.vercel.app/api/test-db`
   - If it fails, the database isn't properly set up

3. **Check Environment Variables:**
   - Ensure `DATABASE_URL` is set correctly
   - Make sure `NEXTAUTH_SECRET` is generated

4. **Redeploy:**
   ```bash
   # Force a new deployment
   git commit --allow-empty -m "Force redeploy"
   git push origin main
   ```

## 🎉 Success Indicators

### ✅ Registration Working:
- Form submits without JSON errors
- Shows "Account created successfully!" message
- Redirects to sign-in page
- User can sign in with new credentials

### ✅ API Endpoints Working:
- `/api/test` returns success message
- `/api/test-db` returns database connection success
- No 500 errors in browser console

Your registration should now work properly on your live Vercel deployment! 🚀 