import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Environment variable checks
    const envChecks = {
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      BACKBLAZE_KEY_ID: process.env.BACKBLAZE_KEY_ID ? 'SET' : 'NOT SET',
      POSTHOG_KEY: process.env.POSTHOG_KEY ? 'SET' : 'NOT SET'
    }

    // Module availability checks
    const moduleChecks = {}
    
    try {
      const { auth } = await import('next-auth')
      moduleChecks.nextAuth = 'OK'
    } catch (error) {
      moduleChecks.nextAuth = `ERROR: ${error.message}`
    }

    try {
      const { PrismaClient } = await import('@prisma/client')
      moduleChecks.prisma = 'OK'
    } catch (error) {
      moduleChecks.prisma = `ERROR: ${error.message}`
    }

    try {
      const { S3Client } = await import('@aws-sdk/client-s3')
      moduleChecks.awsSdk = 'OK'
    } catch (error) {
      moduleChecks.awsSdk = `ERROR: ${error.message}`
    }

    // System information
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envChecks,
      modules: moduleChecks,
      system: systemInfo
    })

  } catch (error) {
    console.error('Debug API Error:', error)
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
