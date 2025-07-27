#!/bin/bash

# Database Setup Script for BV Studios
echo "🗄️ Setting up SQLite database for BV Studios..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it first."
    exit 1
fi

# Check if DATABASE_URL is set to SQLite
if ! grep -q 'DATABASE_URL="file:./dev.db"' .env.local; then
    echo "⚠️  DATABASE_URL not set to SQLite. Updating .env.local..."
    sed -i '' 's|DATABASE_URL="postgresql://username:password@localhost:5432/bvstudios_db"|DATABASE_URL="file:./dev.db"|' .env.local
fi

# Check if NEXTAUTH_SECRET is set
if grep -q 'NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-this-in-production"' .env.local; then
    echo "⚠️  NEXTAUTH_SECRET not set. Generating new secret..."
    SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    sed -i '' "s|NEXTAUTH_SECRET=\"your-super-secret-nextauth-key-change-this-in-production\"|NEXTAUTH_SECRET=\"$SECRET\"|" .env.local
fi

echo "✅ Environment variables configured!"

# Try to generate Prisma client
echo "🔨 Generating Prisma client..."
if command -v npx &> /dev/null; then
    npx prisma generate
else
    echo "⚠️  npx not available. Please install Node.js dependencies first."
fi

# Try to push schema to database
echo "🚀 Pushing schema to database..."
if command -v npx &> /dev/null; then
    npx prisma db push
else
    echo "⚠️  npx not available. Please install Node.js dependencies first."
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Start development server: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "🔧 If npm install fails due to cache issues:"
echo "   sudo chown -R $(whoami) ~/.npm"
echo "   npm cache clean --force"
echo "   npm install" 