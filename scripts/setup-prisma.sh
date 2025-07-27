#!/bin/bash

# Prisma Setup Script for BV Studios
echo "🔧 Setting up Prisma for BV Studios..."

# Check if Prisma CLI is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Node.js/npm is not installed. Please install Node.js first."
    exit 1
fi

# Install Prisma CLI globally if not already installed
echo "📦 Installing Prisma CLI..."
npm install -g prisma

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Please set it in your .env.local file."
    echo "Example: DATABASE_URL=\"postgresql://username:password@localhost:5432/bvstudios_db\""
    echo ""
    echo "For development, you can use:"
    echo "DATABASE_URL=\"file:./dev.db\" (SQLite)"
    echo "DATABASE_URL=\"postgresql://postgres:password@localhost:5432/bvstudios_db\" (PostgreSQL)"
    echo ""
    echo "After setting DATABASE_URL, run:"
    echo "npx prisma db push"
    exit 1
fi

# Push schema to database
echo "🚀 Pushing schema to database..."
npx prisma db push

# Generate Prisma client again after schema push
echo "🔨 Regenerating Prisma client..."
npx prisma generate

echo "✅ Prisma setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your database URL in .env.local"
echo "2. Run: npx prisma db push"
echo "3. Run: npx prisma generate"
echo "4. Start your development server: npm run dev" 