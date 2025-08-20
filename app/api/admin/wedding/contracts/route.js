import { NextResponse } from 'next/server'
// import { prisma } from '../../../../lib/prisma.js'

export async function GET() {
  try {
    // For now, return mock data since we don't have a contracts model yet
    const mockContracts = [
      {
        id: 'contract_1',
        clientName: 'John & Jane Doe',
        eventDate: '2024-10-15',
        package: 'Premium Wedding',
        status: 'signed',
        value: 2500,
        createdAt: new Date().toISOString()
      },
      {
        id: 'contract_2',
        clientName: 'Mike & Sarah Smith',
        eventDate: '2024-11-20',
        package: 'Standard Wedding',
        status: 'pending',
        value: 1800,
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({ contracts: mockContracts })
  } catch (error) {
    console.error('Error fetching wedding contracts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch wedding contracts',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
