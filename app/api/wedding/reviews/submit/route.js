import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      weddingDate,
      clientName,
      rating,
      review,
      service,
      venue,
      recommend,
    } = body

    // Validate required fields
    if (!weddingDate || !clientName || !rating || !review) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Mock review submission - replace with actual database insert
    const newReview = {
      id: Date.now(),
      weddingDate,
      clientName,
      rating: parseInt(rating),
      review,
      service: service || 'Wedding Video',
      venue: venue || 'Not specified',
      recommend: recommend !== undefined ? recommend : true,
      submittedBy: session.user.email,
      submittedAt: new Date().toISOString(),
      status: 'pending', // For admin approval
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification to admin
    // 3. Update average rating
    // 4. Send confirmation email to client

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully',
        data: newReview,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Wedding Review Submit API Error:', error)
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
    const status = searchParams.get('status') || 'approved'
    const limit = searchParams.get('limit') || 10

    // Mock reviews data - replace with actual database query
    const allReviews = [
      {
        id: 1,
        weddingDate: '2024-06-15',
        clientName: 'Sarah & David Johnson',
        rating: 5,
        review:
          "Absolutely amazing work! Dominic and his team captured our special day perfectly. The video is beautiful and we couldn't be happier.",
        service: 'Premium Wedding Package',
        venue: 'Kentucky Horse Park',
        recommend: true,
        submittedAt: '2024-07-01T10:00:00Z',
        status: 'approved',
      },
      {
        id: 2,
        weddingDate: '2024-05-20',
        clientName: 'Michael & Emily Chen',
        rating: 5,
        review:
          'Professional, creative, and delivered exactly what we wanted. The drone footage of our venue was incredible!',
        service: 'Standard Wedding Package + Drone',
        venue: 'Gratz Park Inn',
        recommend: true,
        submittedAt: '2024-06-05T14:30:00Z',
        status: 'approved',
      },
    ]

    // Filter reviews by status
    const filteredReviews = allReviews.filter((r) => r.status === status)
    const limitedReviews = filteredReviews.slice(0, parseInt(limit))

    return NextResponse.json({
      success: true,
      data: limitedReviews,
      total: filteredReviews.length,
      status,
    })
  } catch (error) {
    console.error('Wedding Review Submit API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
