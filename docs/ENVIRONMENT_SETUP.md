# 🔧 Environment Variables Setup Guide

## 📋 Required Environment Variables

### 🔐 **NextAuth Configuration**

#### **NEXTAUTH_SECRET** (Required)
Generate a secure random string:
```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

#### **NEXTAUTH_URL** (Required)
- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.vercel.app`

### 🗄️ **Database Configuration**

#### **DATABASE_URL** (Required)
Choose your database provider:

**Option 1: PostgreSQL (Recommended)**
```
DATABASE_URL="postgresql://username:password@localhost:5432/bvstudios_db"
```

**Option 2: Supabase (Free tier available)**
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**Option 3: PlanetScale (Free tier available)**
```
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/bvstudios_db?sslaccept=strict"
```

**Option 4: Railway (Free tier available)**
```
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway"
```

### 📧 **Email Configuration**

#### **Gmail Setup (Recommended)**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use these settings:
```
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-gmail@gmail.com"
EMAIL_SERVER_PASSWORD="your-16-digit-app-password"
EMAIL_FROM="noreply@bvstudios.com"
```

#### **SendGrid Setup (Alternative)**
1. Create a SendGrid account
2. Generate an API key
3. Use these settings:
```
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="noreply@bvstudios.com"
```

### 🔑 **OAuth Providers (Optional)**

#### **Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`

#### **GitHub OAuth Setup**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add callback URL:
   - `http://localhost:3000/api/auth/callback/github`
   - `https://your-domain.vercel.app/api/auth/callback/github`

## 🚀 **Setup Steps**

### **1. Local Development**
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### **2. Production (Vercel)**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable from your `.env.local`

### **3. Database Setup**
```bash
# Install Prisma CLI
npm install -g prisma

# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push
```

## 🔒 **Security Checklist**

- ✅ **NEXTAUTH_SECRET** is a strong random string
- ✅ **DATABASE_URL** uses SSL in production
- ✅ **EMAIL_SERVER_PASSWORD** is an app password (not regular password)
- ✅ **OAuth secrets** are kept secure
- ✅ **Production URLs** are HTTPS
- ✅ **No secrets** are committed to Git

## 📝 **Example .env.local**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bvstudios_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"

# Email (Gmail)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@bvstudios.com"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="BV Studios"
```

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **"Invalid redirect URI"** - Check OAuth callback URLs
2. **"Database connection failed"** - Verify DATABASE_URL format
3. **"Email not sending"** - Check email credentials and app passwords
4. **"NextAuth secret not set"** - Generate a new NEXTAUTH_SECRET

### **Testing:**
```bash
# Test database connection
npx prisma db pull

# Test email (if configured)
npm run test:email

# Test authentication
npm run dev
```

## 📚 **Resources**

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Setup](https://sendgrid.com/docs/for-developers/sending-email/) 