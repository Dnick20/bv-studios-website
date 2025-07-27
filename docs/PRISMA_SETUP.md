# 🗄️ Prisma Database Setup Guide

## 📋 Overview

This guide will help you set up Prisma with your BV Studios authentication system. Prisma is an ORM (Object-Relational Mapping) that provides type-safe database access.

## 🏗️ Database Schema

The current schema includes the following models:

### **User Model**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  files    File[]
}
```

### **Account Model** (for OAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### **Session Model** (for NextAuth sessions)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### **File Model** (for user file management)
```prisma
model File {
  id          String   @id @default(cuid())
  name        String
  url         String
  type        String   // 'image', 'video', 'document'
  size        Int?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### **VerificationToken Model** (for email verification)
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## 🚀 Setup Instructions

### **1. Install Dependencies**
```bash
# Install Prisma CLI
npm install -g prisma

# Install Prisma client (already in package.json)
npm install @prisma/client
```

### **2. Configure Database URL**

Add your database URL to `.env.local`:

#### **Option A: PostgreSQL (Recommended)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bvstudios_db"
```

#### **Option B: Supabase (Free tier)**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

#### **Option C: PlanetScale (Free tier)**
```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/bvstudios_db?sslaccept=strict"
```

#### **Option D: Railway (Free tier)**
```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway"
```

#### **Option E: SQLite (Development only)**
```env
DATABASE_URL="file:./dev.db"
```

### **3. Initialize Database**

#### **Method A: Using the setup script**
```bash
# Make script executable
chmod +x scripts/setup-prisma.sh

# Run setup script
./scripts/setup-prisma.sh
```

#### **Method B: Manual setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Create a migration
npx prisma migrate dev --name init
```

### **4. Verify Setup**
```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Check database connection
npx prisma db pull
```

## 🔧 Database Providers

### **PostgreSQL (Recommended)**
- **Pros**: Full-featured, excellent performance, ACID compliance
- **Cons**: Requires setup
- **Free Options**: Supabase, Railway, Neon

### **MySQL**
- **Pros**: Widely supported, good performance
- **Cons**: Limited features compared to PostgreSQL
- **Free Options**: PlanetScale, Railway

### **SQLite**
- **Pros**: Zero setup, file-based
- **Cons**: Not suitable for production, limited concurrent users
- **Use Case**: Development only

## 📊 Database Operations

### **Generate Prisma Client**
```bash
npx prisma generate
```

### **Push Schema Changes**
```bash
npx prisma db push
```

### **Create Migration**
```bash
npx prisma migrate dev --name add_new_field
```

### **Reset Database**
```bash
npx prisma migrate reset
```

### **View Database**
```bash
npx prisma studio
```

## 🔍 Troubleshooting

### **Common Issues:**

#### **1. "Database connection failed"**
- Check your `DATABASE_URL` format
- Ensure database server is running
- Verify credentials are correct

#### **2. "Prisma client not generated"**
```bash
npx prisma generate
```

#### **3. "Schema out of sync"**
```bash
npx prisma db push
# or
npx prisma migrate dev
```

#### **4. "Permission denied"**
- Check database user permissions
- Ensure SSL is configured correctly for production

### **Debug Commands:**
```bash
# Check Prisma version
npx prisma --version

# Validate schema
npx prisma validate

# Format schema
npx prisma format

# Check database connection
npx prisma db pull
```

## 📚 Production Deployment

### **Vercel Deployment:**
1. Set `DATABASE_URL` in Vercel environment variables
2. Ensure database is accessible from Vercel
3. Run `npx prisma generate` in build step

### **Database Migration:**
```bash
# Create production migration
npx prisma migrate deploy

# Apply migrations
npx prisma migrate resolve --applied "migration_name"
```

## 🔒 Security Considerations

- ✅ **Use environment variables** for database URLs
- ✅ **Enable SSL** for production databases
- ✅ **Use strong passwords** for database users
- ✅ **Limit database user permissions** to necessary operations
- ✅ **Regular backups** of production data

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js with Prisma](https://next-auth.js.org/adapters/prisma)
- [Database Best Practices](https://www.prisma.io/docs/guides/database/best-practices)
- [Prisma Studio Guide](https://www.prisma.io/docs/concepts/tools/prisma-studio) 