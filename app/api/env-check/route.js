import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check critical environment variables
    const criticalVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL'
    ]

    const envStatus = {}
    const missingVars = []

    criticalVars.forEach(varName => {
      if (process.env[varName]) {
        envStatus[varName] = 'SET'
      } else {
        envStatus[varName] = 'NOT SET'
        missingVars.push(varName)
      }
    })

    // Check optional but important variables
    const optionalVars = [
      'BACKBLAZE_KEY_ID',
      'BACKBLAZE_APPLICATION_KEY',
      'BACKBLAZE_ENDPOINT',
      'POSTHOG_KEY',
      'POSTHOG_HOST',
      'JWT_SECRET',
      'ADMIN_TOKEN'
    ]

    optionalVars.forEach(varName => {
      if (process.env[varName]) {
        envStatus[varName] = 'SET'
      } else {
        envStatus[varName] = 'NOT SET'
      }
    })

    // Check NODE_ENV
    envStatus.NODE_ENV = process.env.NODE_ENV || 'NOT SET'

    // Determine overall status
    const isHealthy = missingVars.length === 0
    const status = isHealthy ? 'healthy' : 'unhealthy'

    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
      environment: envStatus,
      missing: missingVars,
      recommendations: missingVars.length > 0 ? [
        'Set all critical environment variables',
        'Check your .env.local file',
        'Verify Vercel environment variables'
      ] : [
        'All critical environment variables are set',
        'System is ready for production'
      ]
    })

  } catch (error) {
    console.error('Env Check API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    )
  }
}
