import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // Validate webhook signature (mock implementation)
    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing signature' },
        { status: 400 }
      )
    }

    // Parse the webhook event
    let event
    try {
      // Mock event parsing - replace with actual Stripe webhook verification
      event = JSON.parse(body)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        // Handle successful payment
        break
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        // Handle failed payment
        break
        
      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded:', event.data.object.id)
        // Handle successful invoice payment
        break
        
      case 'invoice.payment_failed':
        console.log('Invoice payment failed:', event.data.object.id)
        // Handle failed invoice payment
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ success: true, received: true })

  } catch (error) {
    console.error('Stripe Webhook Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
