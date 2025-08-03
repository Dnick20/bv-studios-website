import { buffer } from 'micro'
import Stripe from 'stripe'
import { prisma } from '../../../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
}

// Optimized event handler mapping
const eventHandlers = {
  'customer.created': handleCustomerCreated,
  'customer.updated': handleCustomerUpdated,
  'customer.deleted': handleCustomerDeleted,
  'payment_intent.succeeded': handlePaymentIntentSucceeded,
  'payment_intent.payment_failed': handlePaymentIntentFailed,
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
  'invoice.payment_failed': handleInvoicePaymentFailed,
  'customer.subscription.created': handleSubscriptionCreated,
  'customer.subscription.updated': handleSubscriptionUpdated,
  'customer.subscription.deleted': handleSubscriptionDeleted,
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'account.updated': handleAccountUpdated,
  'file.created': handleFileCreated,
  'file.updated': handleFileUpdated,
  'file.deleted': handleFileDeleted,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  console.log('Received webhook event:', event.type)

  try {
    // Use optimized event handler mapping
    const handler = eventHandlers[event.type]
    
    if (handler) {
      await handler(event.data.object)
    } else {
      console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}

// Customer event handlers
async function handleCustomerCreated(customer) {
  console.log('Customer created:', customer.id)
  
  try {
    // Create or update user record with Stripe customer ID
    await prisma.user.upsert({
      where: { email: customer.email },
      update: {
        stripeCustomerId: customer.id,
        name: customer.name,
        metadata: customer.metadata,
      },
      create: {
        email: customer.email,
        name: customer.name,
        stripeCustomerId: customer.id,
        metadata: customer.metadata,
        role: 'customer',
      },
    })

    // Send welcome email
    await sendWelcomeEmail(customer.email, customer.name)
  } catch (error) {
    console.error('Error handling customer created:', error)
  }
}

async function handleCustomerUpdated(customer) {
  console.log('Customer updated:', customer.id)
  
  try {
    await prisma.user.updateMany({
      where: { stripeCustomerId: customer.id },
      data: {
        name: customer.name,
        metadata: customer.metadata,
      },
    })
  } catch (error) {
    console.error('Error handling customer updated:', error)
  }
}

async function handleCustomerDeleted(customer) {
  console.log('Customer deleted:', customer.id)
  
  try {
    // Mark user as inactive but don't delete for audit purposes
    await prisma.user.updateMany({
      where: { stripeCustomerId: customer.id },
      data: {
        active: false,
        deletedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error handling customer deleted:', error)
  }
}

// Payment event handlers
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: paymentIntent.customer },
    })

    if (user) {
      // Create payment record
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'succeeded',
          metadata: paymentIntent.metadata,
        },
      })

      // Send payment confirmation email
      await sendPaymentConfirmationEmail(user.email, paymentIntent)
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: paymentIntent.customer },
    })

    if (user) {
      // Create payment record
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'failed',
          metadata: paymentIntent.metadata,
        },
      })

      // Send payment failure email
      await sendPaymentFailureEmail(user.email, paymentIntent)
    }
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

// Invoice event handlers
async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer },
    })

    if (user) {
      // Update subscription status
      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: invoice.subscription },
        update: {
          status: 'active',
          currentPeriodEnd: new Date(invoice.period_end * 1000),
        },
        create: {
          userId: user.id,
          stripeSubscriptionId: invoice.subscription,
          status: 'active',
          currentPeriodEnd: new Date(invoice.period_end * 1000),
        },
      })

      // Send invoice email
      await sendInvoiceEmail(user.email, invoice)
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id)
  
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer },
    })

    if (user) {
      // Update subscription status
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: invoice.subscription },
        data: {
          status: 'past_due',
        },
      })

      // Send payment failure email
      await sendInvoicePaymentFailureEmail(user.email, invoice)
    }
  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
  }
}

// Subscription event handlers
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id)
  
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer },
    })

    if (user) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          planId: subscription.items.data[0]?.price?.id,
        },
      })

      // Send subscription confirmation email
      await sendSubscriptionConfirmationEmail(user.email, subscription)
    }
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id)
  
  try {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        planId: subscription.items.data[0]?.price?.id,
      },
    })
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  try {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

// Checkout session handler
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id)
  
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: session.customer },
    })

    if (user) {
      // Update user with subscription info if applicable
      if (session.subscription) {
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: session.subscription },
          update: {
            status: 'active',
          },
          create: {
            userId: user.id,
            stripeSubscriptionId: session.subscription,
            status: 'active',
          },
        })
      }

      // Send order confirmation email
      await sendOrderConfirmationEmail(user.email, session)
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

// Account event handlers
async function handleAccountUpdated(account) {
  console.log('Account updated:', account.id)
  
  try {
    // Handle connected account updates if using Connect
    // This would be relevant if you're using Stripe Connect for marketplace functionality
  } catch (error) {
    console.error('Error handling account updated:', error)
  }
}

// File event handlers (if using Stripe for file storage)
async function handleFileCreated(file) {
  console.log('File created:', file.id)
  
  try {
    // Handle file creation if using Stripe for file storage
    // This would be relevant if you're using Stripe's file upload feature
  } catch (error) {
    console.error('Error handling file created:', error)
  }
}

async function handleFileUpdated(file) {
  console.log('File updated:', file.id)
  
  try {
    // Handle file updates
  } catch (error) {
    console.error('Error handling file updated:', error)
  }
}

async function handleFileDeleted(file) {
  console.log('File deleted:', file.id)
  
  try {
    // Handle file deletion
  } catch (error) {
    console.error('Error handling file deleted:', error)
  }
}

// Email notification functions
async function sendWelcomeEmail(email, name) {
  // Implement email sending logic
  console.log(`Sending welcome email to ${email}`)
}

async function sendPaymentConfirmationEmail(email, paymentIntent) {
  console.log(`Sending payment confirmation email to ${email}`)
}

async function sendPaymentFailureEmail(email, paymentIntent) {
  console.log(`Sending payment failure email to ${email}`)
}

async function sendInvoiceEmail(email, invoice) {
  console.log(`Sending invoice email to ${email}`)
}

async function sendInvoicePaymentFailureEmail(email, invoice) {
  console.log(`Sending invoice payment failure email to ${email}`)
}

async function sendSubscriptionConfirmationEmail(email, subscription) {
  console.log(`Sending subscription confirmation email to ${email}`)
}

async function sendOrderConfirmationEmail(email, session) {
  console.log(`Sending order confirmation email to ${email}`)
} 