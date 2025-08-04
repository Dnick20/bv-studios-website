import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../../lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const { quoteId, paymentType } = req.body

    // Fetch the quote with package and addons
    const quote = await prisma.weddingQuote.findUnique({
      where: { id: quoteId },
      include: {
        package: true,
        addons: {
          include: {
            addon: true
          }
        },
        user: true
      }
    })

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    if (quote.userId !== session.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Calculate payment amount based on type
    let amount
    let description

    if (paymentType === 'deposit') {
      amount = Math.round(quote.totalPrice * 0.5) // 50% deposit
      description = `Deposit for ${quote.package.name} - ${quote.user.name}`
    } else if (paymentType === 'full') {
      amount = quote.totalPrice
      description = `Full payment for ${quote.package.name} - ${quote.user.name}`
    } else {
      return res.status(400).json({ message: 'Invalid payment type' })
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      description: description,
      metadata: {
        quoteId: quoteId,
        packageId: quote.packageId,
        userId: session.user.id,
        paymentType: paymentType,
        eventDate: quote.eventDate,
        eventTime: quote.eventTime
      }
    })

    // Update quote with payment intent
    await prisma.weddingQuote.update({
      where: { id: quoteId },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        paymentStatus: paymentType === 'deposit' ? 'deposit_paid' : 'paid'
      }
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: 'usd'
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    res.status(500).json({ message: 'Error creating payment intent' })
  }
} 