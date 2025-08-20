import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/imports.js'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, role = 'user' } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
