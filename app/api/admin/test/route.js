import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Admin test endpoint working',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      {
        error: 'Test API failed',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
