import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request) {
  try {
    // Get form data
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client IP for rate limiting (basic protection)
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    // Log contact submission (for analytics/debugging)
    console.log(`Contact form submission from ${clientIp}:`, {
      name: name.substring(0, 20), // Partial name for privacy
      email: email.split('@')[1], // Domain only for privacy
      messageLength: message.length,
      timestamp: new Date().toISOString()
    })

    // TODO: Add your email service integration here
    // Options: Mailgun, SendGrid, AWS SES, Resend, etc.
    // For now, we'll simulate success but you'll need to implement actual email sending

    /*
    // Example with Mailgun (uncomment and configure when ready):
    const mailgun = require('mailgun-js')({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    })

    const emailData = {
      from: 'website@bvstudios.com',
      to: 'info@bvstudios.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted from BV Studios website</small></p>
      `
    }

    await mailgun.messages().send(emailData)
    */

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}