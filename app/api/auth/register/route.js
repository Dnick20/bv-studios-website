import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma.js'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    // Log with more context for server-side inspection
    console.error('[Auth/Register] Error:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
    })

    // Map known errors to appropriate HTTP statuses
    let status = 500
    let errorMessage = 'Internal server error'

    // Prisma unique constraint (email already exists)
    if (error?.code === 'P2002') {
      status = 409
      errorMessage = 'User with this email already exists'
    }

    // Prisma connection / record not found variants
    if (error?.code === 'P1001' || error?.message?.includes('connect')) {
      status = 503
      errorMessage = 'Database connection failed'
    }

    if (error?.message?.toLowerCase()?.includes('bcrypt')) {
      status = 500
      errorMessage = 'Password encryption failed'
    }

    return NextResponse.json(
      {
        message: errorMessage,
        // Temporary diagnostics to unblock production debugging; safe to remove once stable
        code: error?.code ?? null,
        hint:
          status === 503
            ? 'Check DATABASE_URL connectivity and that the database schema is migrated.'
            : status === 409
            ? 'Try signing in or use a different email.'
            : 'See server logs for stack trace.',
        detail: (error?.message || '').slice(0, 300) || null,
      },
      { status }
    )
  }
}
