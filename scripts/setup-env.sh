#!/bin/bash

# Create .env.local file with required environment variables
cat > .env.local << 'EOF'
# NextAuth Configuration
NEXTAUTH_URL=https://bv-studios-website.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Database Configuration (SQLite for development)
DATABASE_URL="file:./prisma/dev.db"

# Optional: OAuth Providers (uncomment if you want to use them)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_ID=your-github-client-id
# GITHUB_SECRET=your-github-client-secret

# Email Configuration (for password reset, etc.)
# EMAIL_SERVER_HOST=smtp.gmail.com
# EMAIL_SERVER_PORT=587
# EMAIL_SERVER_USER=your-email@gmail.com
# EMAIL_SERVER_PASSWORD=your-app-password

# Stripe Configuration (if using payments)
# STRIPE_SECRET_KEY=your-stripe-secret-key
# STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
EOF

echo "✅ .env.local file created!"
echo "📝 Please update the NEXTAUTH_SECRET with a secure random string"
echo "🔧 You can generate one at: https://generate-secret.vercel.app/32" 