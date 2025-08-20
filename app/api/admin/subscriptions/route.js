import { NextResponse } from 'next/server'
// import { prisma } from '../../../lib/prisma.js'

export async function GET() {
  try {
    // For now, return mock data since we don't have a subscriptions model yet
    const mockSubscriptions = [
      {
        id: 'sub_1',
        clientName: 'John & Jane Doe',
        plan: 'Premium',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2025-01-15',
        monthlyFee: 25
      },
      {
        id: 'sub_2',
        clientName: 'Mike & Sarah Smith',
        plan: 'Standard',
        status: 'trial',
        startDate: '2024-08-01',
        endDate: '2024-09-01',
        monthlyFee: 15
      }
    ]

    return NextResponse.json({ subscriptions: mockSubscriptions })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch subscriptions',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
