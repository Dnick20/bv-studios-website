export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL || 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      GITHUB_ID: process.env.GITHUB_ID ? 'SET' : 'NOT SET',
      GITHUB_SECRET: process.env.GITHUB_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    }

    res.status(200).json({
      message: 'Environment check completed',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      required: [
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
        'DATABASE_URL'
      ],
      optional: [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GITHUB_ID',
        'GITHUB_SECRET'
      ]
    })
  } catch (error) {
    console.error('Environment check error:', error)
    res.status(500).json({ 
      message: 'Environment check failed',
      error: error.message 
    })
  }
} 