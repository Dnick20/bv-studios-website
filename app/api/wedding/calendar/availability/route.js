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
    const month = searchParams.get('month') || new Date().getMonth() + 1
    const year = searchParams.get('year') || new Date().getFullYear()

    // Mock availability data - replace with actual database query
    const availability = generateMockAvailability(
      parseInt(month),
      parseInt(year)
    )

    return NextResponse.json({
      success: true,
      data: availability,
      month: parseInt(month),
      year: parseInt(year),
    })
  } catch (error) {
    console.error('Calendar Availability API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, timeSlot, action } = body

    if (!date || !timeSlot || !action) {
      return NextResponse.json(
        { success: false, message: 'Date, time slot, and action are required' },
        { status: 400 }
      )
    }

    // Mock availability update - replace with actual database update
    console.log(
      `${action} booking for ${date} at ${timeSlot} by ${session.user.email}`
    )

    return NextResponse.json({
      success: true,
      message: `Successfully ${action} booking`,
      data: { date, timeSlot, action, updatedBy: session.user.email },
    })
  } catch (error) {
    console.error('Calendar Availability API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to generate mock availability data
function generateMockAvailability(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const availability = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()

    // Skip Sundays (day 0) and Saturdays (day 6)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const timeSlots = [
        { time: '9:00 AM', available: Math.random() > 0.3 },
        { time: '11:00 AM', available: Math.random() > 0.3 },
        { time: '1:00 PM', available: Math.random() > 0.3 },
        { time: '3:00 PM', available: Math.random() > 0.3 },
        { time: '5:00 PM', available: Math.random() > 0.3 },
      ]

      availability.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`,
        dayOfWeek: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ][dayOfWeek],
        timeSlots,
        notes: Math.random() > 0.8 ? 'Special event day' : null,
      })
    }
  }

  return availability
}
