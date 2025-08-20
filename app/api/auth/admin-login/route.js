import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Hardcoded admin credentials for now
    if (username === 'admin' && password === 'dominic20') {
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: 'admin-1',
          email: 'admin',
          name: 'Admin',
          role: 'admin',
        },
        token: 'admin-token-' + Date.now(),
      })
    }

    // Invalid credentials
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
