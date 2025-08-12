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
        message:
          'Looking for a beautiful wedding video that captures our special day.',
        createdAt: '2024-08-01T10:00:00Z',
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
        createdAt: '2024-08-05T14:30:00Z',
      },
    ]

    // Filter quotes based on status
    let filteredQuotes = allQuotes
    if (status) {
      filteredQuotes = allQuotes.filter((q) => q.status === status)
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
        itemsPerPage: parseInt(limit),
      },
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

    // Minimal server-side catalogs to enrich submitted quotes so My Quotes shows
    // correct names, prices, durations, and selected addons consistently.
    const packageCatalog = [
      { id: 1, name: 'Silver Collection', price: 210000, duration: 4 },
      { id: 2, name: 'Gold Collection', price: 350000, duration: 6 },
      { id: 3, name: 'Diamond Collection', price: 620000, duration: 8 },
    ]
    const addonCatalog = [
      { id: 101, name: 'Ceremony Film', price: 65000 },
      { id: 102, name: 'Engagement Film', price: 65000 },
      { id: 103, name: 'Additional Hours', price: 26000 },
      { id: 104, name: 'Drone Footage', price: 65000 },
    ]

    // If booking payload, compute full package and addons details
    let computedPackage = null
    let computedAddons = []
    let computedTotalPrice = null
    if (isBookingPayload) {
      computedPackage = packageCatalog.find((p) => p.id === body.packageId) || null
      computedAddons = Array.isArray(body.addons)
        ? body.addons.map((a) => {
            const catalog = addonCatalog.find((x) => x.id === a.addonId)
            const price = Number(a.price ?? catalog?.price ?? 0)
            return {
              id: a.addonId,
              addon: {
                id: a.addonId,
                name: catalog?.name || 'Addon',
                price,
              },
            }
          })
        : []
      const packagePrice = computedPackage?.price ?? 0
      const addonsPrice = computedAddons.reduce(
        (sum, item) => sum + Number(item.addon?.price || 0),
        0
      )
      computedTotalPrice = packagePrice + addonsPrice
    }

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
      package: isBookingPayload
        ? {
            id: computedPackage?.id ?? body.packageId ?? null,
            name:
              computedPackage?.name || body.packageName || 'Selected Package',
            price: computedPackage?.price ?? null,
            duration: computedPackage?.duration ?? null,
          }
        : (body.package || 'Selected Package'),
      budget: body.budget || 0,
      message: (isBookingPayload ? body.specialRequests : body.message) || '',
      // Booking-specific extras
      eventTime: isBookingPayload ? body.eventTime || '' : '',
      packageId: isBookingPayload ? body.packageId || null : null,
      venueId: isBookingPayload ? body.venueId || null : null,
      addons: isBookingPayload ? body.addons || [] : [],
      quoteAddons: isBookingPayload ? computedAddons : [],
      guestCount: isBookingPayload ? body.guestCount || null : null,
      totalPrice: isBookingPayload
        ? Number.isFinite(Number(body.totalPrice))
          ? Number(body.totalPrice)
          : computedTotalPrice
        : null,
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
