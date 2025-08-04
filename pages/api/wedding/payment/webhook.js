import { prisma } from '../../../../lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ message: 'Webhook signature verification failed' })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ message: 'Webhook handler error' })
  }
}

async function handlePaymentSuccess(paymentIntent) {
  const { quoteId, paymentType } = paymentIntent.metadata

  // Update quote payment status
  await prisma.weddingQuote.update({
    where: { id: quoteId },
    data: {
      paymentStatus: paymentType === 'deposit' ? 'deposit_paid' : 'paid',
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntent.id
    }
  })

  // If full payment, create wedding event
  if (paymentType === 'full') {
    const quote = await prisma.weddingQuote.findUnique({
      where: { id: quoteId },
      include: {
        package: true,
        addons: {
          include: {
            addon: true
          }
        },
        user: true,
        venue: true
      }
    })

    if (quote) {
      await prisma.weddingEvent.create({
        data: {
          userId: quote.userId,
          packageId: quote.packageId,
          venueId: quote.venueId,
          eventDate: quote.eventDate,
          eventTime: quote.eventTime,
          guestCount: quote.guestCount,
          specialRequests: quote.specialRequests,
          totalPrice: quote.totalPrice,
          status: 'confirmed',
          stripePaymentIntentId: paymentIntent.id
        }
      })
    }
  }

  console.log(`Payment succeeded for quote ${quoteId}, type: ${paymentType}`)
}

async function handlePaymentFailure(paymentIntent) {
  const { quoteId } = paymentIntent.metadata

  await prisma.weddingQuote.update({
    where: { id: quoteId },
    data: {
      paymentStatus: 'failed',
      stripePaymentIntentId: paymentIntent.id
    }
  })

  console.log(`Payment failed for quote ${quoteId}`)
}

async function handlePaymentCanceled(paymentIntent) {
  const { quoteId } = paymentIntent.metadata

  await prisma.weddingQuote.update({
    where: { id: quoteId },
    data: {
      paymentStatus: 'canceled',
      stripePaymentIntentId: paymentIntent.id
    }
  })

  console.log(`Payment canceled for quote ${quoteId}`)
} 