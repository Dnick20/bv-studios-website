export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL || 'NOT SET',
      VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
      VERCEL_ENV: process.env.VERCEL_ENV || 'NOT SET'
    }

    // Check if we can import basic modules
    let moduleChecks = {}
    try {
      const { getServerSession } = await import('next-auth/next')
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

    // Check basic functionality
    const basicChecks = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: Object.keys(req.headers),
      userAgent: req.headers['user-agent'] || 'NOT SET'
    }

    res.status(200).json({
      message: 'Debug information',
      environment: envCheck,
      modules: moduleChecks,
      basic: basicChecks,
      status: 'OK'
    })
  } catch (error) {
    console.error('Debug error:', error)
    res.status(500).json({
      message: 'Debug failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
} 