import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await auth()

    // Check user authentication
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const service = searchParams.get('service')
    const limit = searchParams.get('limit') || 20
    const page = searchParams.get('page') || 1

    // Mock projects data - replace with actual database query
    const allProjects = [
      {
        id: 1,
        title: 'Sarah & David Wedding',
        client: 'Sarah Johnson',
        service: 'wedding',
        status: 'completed',
        startDate: '2024-06-15',
        endDate: '2024-07-15',
        budget: 2500,
        description: 'Beautiful outdoor wedding ceremony and reception',
      },
      {
        id: 2,
        title: 'Lexington Lodge Commercial',
        client: 'Lexington Lodge',
        service: 'commercial',
        status: 'editing',
        startDate: '2024-08-01',
        endDate: '2024-08-30',
        budget: 5000,
        description: '30-second commercial for local business',
      },
      {
        id: 3,
        title: 'Corporate Event Coverage',
        client: 'TechCorp Inc.',
        service: 'event',
        status: 'planning',
        startDate: '2024-09-15',
        endDate: '2024-09-15',
        budget: 1500,
        description: 'Annual company meeting and awards ceremony',
      },
    ]

    // Filter projects based on query parameters
    let filteredProjects = allProjects

    if (status) {
      filteredProjects = filteredProjects.filter((p) => p.status === status)
    }

    if (service) {
      filteredProjects = filteredProjects.filter((p) => p.service === service)
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProjects.length / parseInt(limit)),
        totalItems: filteredProjects.length,
        itemsPerPage: parseInt(limit),
      },
    })
  } catch (error) {
    console.error('Projects API Error:', error)
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
    const { title, client, service, startDate, endDate, budget, description } =
      body

    // Validate required fields
    if (!title || !client || !service || !startDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock project creation - replace with actual database insert
    const newProject = {
      id: Date.now(),
      title,
      client,
      service,
      status: 'planning',
      startDate,
      endDate,
      budget: budget || 0,
      description: description || '',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        data: newProject,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Projects API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
