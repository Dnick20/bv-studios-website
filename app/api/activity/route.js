import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await auth()
    
    // Check user authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const limit = searchParams.get('limit') || 50

    // Mock activity data - replace with actual database query
    const activities = [
      {
        id: 1,
        userId: userId || 'user123',
        type: type || 'page_view',
        description: 'Viewed homepage',
        timestamp: new Date().toISOString(),
        metadata: { page: '/', duration: 120 }
      },
      {
        id: 2,
        userId: userId || 'user123',
        type: type || 'form_submit',
        description: 'Submitted contact form',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        metadata: { form: 'contact', fields: 4 }
      }
    ]

    return NextResponse.json({
      success: true,
      data: activities.slice(0, parseInt(limit)),
      total: activities.length
    })

  } catch (error) {
    console.error('Activity API Error:', error)
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
    const { userId, type, description, metadata } = body

    // Validate required fields
    if (!userId || !type || !description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock activity creation - replace with actual database insert
    const newActivity = {
      id: Date.now(),
      userId,
      type,
      description,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    }

    return NextResponse.json({
      success: true,
      data: newActivity
    }, { status: 201 })

  } catch (error) {
    console.error('Activity API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
