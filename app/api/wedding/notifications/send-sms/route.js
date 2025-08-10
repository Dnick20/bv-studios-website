import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { to, message, template, priority = 'normal' } = body

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { success: false, message: 'To and message are required' },
        { status: 400 }
      )
    }

    // Validate phone number format (basic US format)
    const phoneRegex =
      /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
    if (!phoneRegex.test(to)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Mock SMS sending - replace with actual SMS service (Twilio, AWS SNS, etc.)
    const smsData = {
      id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      message,
      template: template || 'custom',
      priority,
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: session.user.email,
    }

    // Here you would typically:
    // 1. Send SMS via SMS service
    // 2. Log SMS in database
    // 3. Track delivery status
    // 4. Handle delivery failures

    console.log('SMS sent:', smsData)

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      data: smsData,
    })
  } catch (error) {
    console.error('Send SMS API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const limit = searchParams.get('limit') || 20
    const page = searchParams.get('page') || 1

    // Mock SMS history - replace with actual database query
    const allSMS = [
      {
        id: 1,
        to: '+18595550123',
        message: 'Your wedding quote has been received and is being reviewed.',
        template: 'quote_confirmation',
        status: 'sent',
        sentAt: '2024-08-01T10:00:00Z',
        sentBy: 'admin@bluevstudio.com',
      },
      {
        id: 2,
        to: '+18595550456',
        message: 'Payment received! Your wedding date is now confirmed.',
        template: 'payment_confirmation',
        status: 'delivered',
        sentAt: '2024-08-02T14:30:00Z',
        sentBy: 'admin@bluevstudio.com',
      },
    ]

    // Filter SMS by status
    let filteredSMS = allSMS
    if (status !== 'all') {
      filteredSMS = allSMS.filter((sms) => sms.status === status)
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedSMS = filteredSMS.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedSMS,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredSMS.length / parseInt(limit)),
        totalItems: filteredSMS.length,
        itemsPerPage: parseInt(limit),
      },
      status,
    })
  } catch (error) {
    console.error('Send SMS API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
