import { NextResponse } from 'next/server'
// import { prisma } from '../../../../lib/prisma.js'

export async function GET() {
  try {
    // For now, return mock data since we don't have a payments model yet
    const mockPayments = [
      {
        id: 'payment_1',
        clientName: 'John & Jane Doe',
        amount: 1250,
        status: 'paid',
        dueDate: '2024-09-15',
        paidDate: '2024-09-10',
        type: 'deposit'
      },
      {
        id: 'payment_2',
        clientName: 'Mike & Sarah Smith',
        amount: 900,
        status: 'pending',
        dueDate: '2024-10-20',
        paidDate: null,
        type: 'deposit'
      }
    ]

    return NextResponse.json({ payments: mockPayments })
  } catch (error) {
    console.error('Error fetching wedding payments:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch wedding payments',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
