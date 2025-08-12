import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') || 20
    const page = searchParams.get('page') || 1

    // Mock wedding quotes data - replace with actual database query
    const allQuotes = [
      {
        id: 1,
        clientName: 'Sarah & David Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(859) 555-0123',
        weddingDate: '2024-09-15',
        venue: 'Kentucky Horse Park',
        package: 'Premium Wedding Package',
        status: 'pending',
        budget: 3000,
        message: 'Looking for a beautiful wedding video that captures our special day.',
        createdAt: '2024-08-01T10:00:00Z'
      },
      {
        id: 2,
        clientName: 'Michael & Emily Chen',
        email: 'michael.chen@email.com',
        phone: '(859) 555-0456',
        weddingDate: '2024-10-20',
        venue: 'Gratz Park Inn',
        package: 'Standard Wedding Package',
        status: 'approved',
        budget: 2000,
        message: 'Need wedding coverage for our intimate ceremony.',
        createdAt: '2024-08-05T14:30:00Z'
      }
    ]

    // Filter quotes based on status
    let filteredQuotes = allQuotes
    if (status) {
      filteredQuotes = allQuotes.filter(q => q.status === status)
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedQuotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredQuotes.length / parseInt(limit)),
        totalItems: filteredQuotes.length,
        itemsPerPage: parseInt(limit)
      }
    })

  } catch (error) {
    console.error('Wedding Quotes API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await auth().catch(() => null)
    const body = await request.json()

    // Support both booking payload and legacy payload
    const isBookingPayload =
      'packageId' in body || 'eventDate' in body || 'venueName' in body

    const newQuote = {
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      // Common/legacy fields
      clientName: session?.user?.name || body.clientName || '',
      email: session?.user?.email || body.email || '',
      phone: body.phone || '',
      weddingDate: (isBookingPayload ? body.eventDate : body.weddingDate) || '',
      venue:
        (isBookingPayload ? body.venueName : body.venue) ||
        (isBookingPayload && body.venueId ? `venue:${body.venueId}` : ''),
      package:
        (isBookingPayload ? body.packageName : body.package) || 'Selected Package',
      budget: body.budget || 0,
      message: (isBookingPayload ? body.specialRequests : body.message) || '',
      // Booking-specific extras
      eventTime: isBookingPayload ? body.eventTime || '' : '',
      packageId: isBookingPayload ? body.packageId || null : null,
      venueId: isBookingPayload ? body.venueId || null : null,
      addons: isBookingPayload ? body.addons || [] : [],
      guestCount: isBookingPayload ? body.guestCount || null : null,
      totalPrice: isBookingPayload ? body.totalPrice || null : null,
    }

    return NextResponse.json(
      {
        success: true,
        data: newQuote,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Wedding Quotes API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
