import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency = 'usd', description, metadata } = body

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Mock payment intent creation - replace with actual Stripe integration
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: 'requires_payment_method',
      description: description || 'Payment for services',
      metadata: metadata || {},
      created: Math.floor(Date.now() / 1000),
      client_secret: `pi_${Date.now()}_secret_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    }

    return NextResponse.json({
      success: true,
      data: paymentIntent,
    })
  } catch (error) {
    console.error('Payment Intent API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
