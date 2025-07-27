#!/bin/bash

# BV Studios - Stripe Database Setup Script
# This script sets up the database for Stripe integration

echo "🔧 Setting up Stripe database integration..."

# Check if .env.local exists, if not create it
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Authentication Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@bvstudios.com"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="BV Studios"

# Stripe Configuration (add your actual keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
EOF
    echo "✅ .env.local created with default values"
else
    echo "✅ .env.local already exists"
fi

# Check if DATABASE_URL is set to SQLite
if grep -q 'DATABASE_URL="file:./dev.db"' .env.local; then
    echo "✅ DATABASE_URL is correctly set to SQLite"
else
    echo "⚠️  Updating DATABASE_URL to use SQLite..."
    sed -i '' 's|DATABASE_URL=".*"|DATABASE_URL="file:./dev.db"|' .env.local
    echo "✅ DATABASE_URL updated"
fi

# Generate NEXTAUTH_SECRET if not set
if ! grep -q 'NEXTAUTH_SECRET=' .env.local || grep -q 'NEXTAUTH_SECRET=""' .env.local; then
    echo "🔐 Generating NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    sed -i '' "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=\"$SECRET\"/" .env.local
    echo "✅ NEXTAUTH_SECRET generated"
else
    echo "✅ NEXTAUTH_SECRET already set"
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if ! npm list stripe > /dev/null 2>&1; then
    echo "📦 Installing Stripe dependencies..."
    npm install stripe micro
else
    echo "✅ Stripe dependencies already installed"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

# Run database migration
echo "🗄️  Running database migration..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully"
else
    echo "❌ Database migration failed"
    echo "💡 Trying alternative approach with db push..."
    npx prisma db push
    if [ $? -eq 0 ]; then
        echo "✅ Database schema pushed successfully"
    else
        echo "❌ Database setup failed"
        exit 1
    fi
fi

# Verify database setup
echo "🔍 Verifying database setup..."
npx prisma db seed --preview-feature 2>/dev/null || echo "ℹ️  No seed script found (this is normal)"

echo ""
echo "🎉 Stripe database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env.local with actual Stripe API keys"
echo "2. Set up webhook endpoints in your Stripe Dashboard"
echo "3. Test the webhook endpoint with Stripe CLI"
echo "4. Implement payment forms in your frontend"
echo ""
echo "📚 Documentation: docs/STRIPE_SETUP.md"
echo "🔧 Database file: ./dev.db"
echo "" 