import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // week, month, quarter, year
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Mock analytics data - replace with actual database queries
    const analytics = generateMockAnalytics(period, startDate, endDate)

    return NextResponse.json({
      success: true,
      data: analytics,
      period,
      dateRange: { startDate, endDate },
    })
  } catch (error) {
    console.error('Wedding Analytics Dashboard API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to generate mock analytics data
function generateMockAnalytics(period, startDate, endDate) {
  const now = new Date()
  let dataPoints = 12 // Default to monthly data

  switch (period) {
    case 'week':
      dataPoints = 7
      break
    case 'month':
      dataPoints = 12
      break
    case 'quarter':
      dataPoints = 4
      break
    case 'year':
      dataPoints = 5
      break
  }

  const revenue = []
  const bookings = []
  const inquiries = []
  const labels = []

  for (let i = dataPoints - 1; i >= 0; i--) {
    let label
    switch (period) {
      case 'week':
        label = `Week ${i + 1}`
        break
      case 'month':
        label = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        ).toLocaleDateString('en-US', { month: 'short' })
        break
      case 'quarter':
        label = `Q${Math.ceil((now.getMonth() - i * 3) / 3)}`
        break
      case 'year':
        label = (now.getFullYear() - i).toString()
        break
    }

    labels.push(label)
    revenue.push(Math.floor(Math.random() * 5000) + 2000)
    bookings.push(Math.floor(Math.random() * 8) + 2)
    inquiries.push(Math.floor(Math.random() * 15) + 5)
  }

  return {
    overview: {
      totalRevenue: revenue.reduce((sum, val) => sum + val, 0),
      totalBookings: bookings.reduce((sum, val) => sum + val, 0),
      totalInquiries: inquiries.reduce((sum, val) => sum + val, 0),
      averageRating: 4.8,
      conversionRate: 23.5,
    },
    trends: {
      revenue: {
        labels,
        data: revenue,
        trend: 'up',
        percentage: 15.2,
      },
      bookings: {
        labels,
        data: bookings,
        trend: 'up',
        percentage: 8.7,
      },
      inquiries: {
        labels,
        data: inquiries,
        trend: 'stable',
        percentage: 2.1,
      },
    },
    topVenues: [
      { name: 'Kentucky Horse Park', bookings: 12, revenue: 28000 },
      { name: 'Gratz Park Inn', bookings: 8, revenue: 18000 },
      { name: 'Keeneland', bookings: 6, revenue: 15000 },
      { name: 'The Barn at Shaker Village', bookings: 4, revenue: 9000 },
    ],
    popularPackages: [
      { name: 'Premium Wedding Package', bookings: 18, revenue: 45000 },
      { name: 'Standard Wedding Package', bookings: 12, revenue: 18000 },
      { name: 'Luxury Wedding Package', bookings: 6, revenue: 24000 },
    ],
    seasonalTrends: {
      spring: { bookings: 15, revenue: 35000 },
      summer: { bookings: 25, revenue: 60000 },
      fall: { bookings: 20, revenue: 48000 },
      winter: { bookings: 8, revenue: 19000 },
    },
  }
}
