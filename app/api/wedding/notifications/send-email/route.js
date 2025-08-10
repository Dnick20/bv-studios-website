import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { to, subject, template, data, priority = 'normal' } = body

    // Validate required fields
    if (!to || !subject || !template) {
      return NextResponse.json(
        { success: false, message: 'To, subject, and template are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Mock email sending - replace with actual email service (SendGrid, AWS SES, etc.)
    const emailData = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      subject,
      template,
      data: data || {},
      priority,
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: session.user.email,
    }

    // Here you would typically:
    // 1. Send email via email service
    // 2. Log email in database
    // 3. Track delivery status
    // 4. Handle bounces and failures

    console.log('Email sent:', emailData)

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: emailData,
    })
  } catch (error) {
    console.error('Send Email API Error:', error)
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

    // Mock email history - replace with actual database query
    const allEmails = [
      {
        id: 1,
        to: 'sarah.johnson@email.com',
        subject: 'Wedding Quote Confirmation',
        template: 'quote_confirmation',
        status: 'sent',
        sentAt: '2024-08-01T10:00:00Z',
        sentBy: 'admin@bluevstudio.com',
      },
      {
        id: 2,
        to: 'michael.chen@email.com',
        subject: 'Payment Confirmation',
        template: 'payment_confirmation',
        status: 'delivered',
        sentAt: '2024-08-02T14:30:00Z',
        sentBy: 'admin@bluevstudio.com',
      },
    ]

    // Filter emails by status
    let filteredEmails = allEmails
    if (status !== 'all') {
      filteredEmails = allEmails.filter((email) => email.status === status)
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedEmails = filteredEmails.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedEmails,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredEmails.length / parseInt(limit)),
        totalItems: filteredEmails.length,
        itemsPerPage: parseInt(limit),
      },
      status,
    })
  } catch (error) {
    console.error('Send Email API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
