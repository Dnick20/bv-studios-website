# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for your BV Studios website.

## 🔑 Environment Variables

Add these variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..." # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET="whsec_..." # Your webhook endpoint secret

# Optional: Stripe Connect (for marketplace functionality)
STRIPE_CONNECT_CLIENT_ID="ca_..." # Only if using Connect
```

## 📋 Prerequisites

1. **Stripe Account**: Create a [Stripe account](https://dashboard.stripe.com/register)
2. **API Keys**: Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. **Webhook Endpoint**: Set up webhook endpoints in your Stripe Dashboard

## 🚀 Setup Steps

### 1. Install Dependencies

The required dependencies are already added to `package.json`:
- `stripe`: Stripe SDK
- `micro`: For webhook body parsing

### 2. Database Schema

The Prisma schema has been updated with new models:

```prisma
model User {
  // ... existing fields
  stripeCustomerId  String?   @unique
  active            Boolean   @default(true)
  deletedAt         DateTime?
  metadata          Json?
  payments          Payment[]
  subscriptions     Subscription[]
}

model Payment {
  id                    String   @id @default(cuid())
  userId                String
  stripePaymentIntentId String   @unique
  amount                Int
  currency              String   @default("usd")
  status                String
  metadata              Json?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Subscription {
  id                   String    @id @default(cuid())
  userId               String
  stripeSubscriptionId String    @unique
  status               String
  planId               String?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  canceledAt           DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 3. Update Database

Run these commands to update your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push
```

### 4. Stripe Dashboard Configuration

#### A. Create Products and Prices

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create products for your services:
   - **Wedding Films**: Basic, Premium, Deluxe packages
   - **Commercial Videos**: Corporate, Marketing, Event packages
   - **Subscription Plans**: Monthly/Yearly access to premium content

#### B. Set Up Webhook Endpoints

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select these events to listen for:

**Customer Events:**
- `customer.created`
- `customer.updated`
- `customer.deleted`

**Payment Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Invoice Events:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Subscription Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Checkout Events:**
- `checkout.session.completed`

5. Copy the webhook signing secret and add it to your `.env.local`

### 5. Test Webhook Endpoint

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Or download from: https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 🔧 API Endpoints

### Payment Intent Creation

```javascript
// pages/api/create-payment-intent.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, currency = 'usd', customerId } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata: {
        integration_check: 'accept_a_payment',
      },
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### Checkout Session Creation

```javascript
// pages/api/create-checkout-session.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { priceId, customerId, successUrl, cancelUrl } = req.body

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // or 'subscription'
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

## 🎯 Frontend Integration

### Payment Form Component

```javascript
// components/PaymentForm.js
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PaymentForm({ amount, customerId }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, customerId }),
      })
      
      const { clientSecret } = await response.json()
      
      const stripe = await stripePromise
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: { name: 'Jenny Rosen' },
        }
      })
      
      if (error) {
        console.error('Payment failed:', error)
      } else {
        console.log('Payment succeeded!')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePayment}>
      {/* Payment form elements */}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}
```

### Checkout Button Component

```javascript
// components/CheckoutButton.js
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function CheckoutButton({ priceId, customerId }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          customerId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      })
      
      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        console.error('Checkout failed:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : 'Checkout'}
    </button>
  )
}
```

## 🧪 Testing

### Test Cards

Use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Webhooks

1. Use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. Test events in Stripe Dashboard:
   - Go to [Webhooks](https://dashboard.stripe.com/webhooks)
   - Click on your endpoint
   - Click "Send test webhook"
   - Select an event type and send

## 🔒 Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always verify webhook signatures** (already implemented)
3. **Use HTTPS** in production
4. **Implement proper error handling**
5. **Log all payment events** for audit trails
6. **Use test keys** during development

## 📊 Monitoring

### Stripe Dashboard

Monitor these metrics in your Stripe Dashboard:
- Payment success/failure rates
- Revenue analytics
- Customer metrics
- Subscription churn

### Application Logs

The webhook handler logs all events:
```javascript
console.log('Received webhook event:', event.type)
console.log('Customer created:', customer.id)
console.log('Payment succeeded:', paymentIntent.id)
```

## 🚀 Production Deployment

### Vercel Environment Variables

Add these to your Vercel project settings:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add all Stripe environment variables

### Webhook URL

Update your webhook endpoint URL in Stripe Dashboard:
```
https://your-domain.vercel.app/api/webhooks/stripe
```

## 🆘 Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook URL is accessible

2. **Payment fails**
   - Verify API keys are correct
   - Check card details are valid
   - Ensure sufficient funds on test cards

3. **Database errors**
   - Run `npx prisma generate` and `npx prisma db push`
   - Check database connection

4. **CORS errors**
   - Ensure proper CORS configuration
   - Check domain settings in Stripe Dashboard

### Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Stripe Community](https://community.stripe.com/)

## 📝 Next Steps

1. **Implement payment forms** in your frontend
2. **Add subscription management** for recurring payments
3. **Create admin dashboard** for payment monitoring
4. **Add email notifications** for payment events
5. **Implement refund handling**
6. **Add analytics and reporting**

Your Stripe integration is now ready! 🎉 