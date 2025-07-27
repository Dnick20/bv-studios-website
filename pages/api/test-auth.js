import { getServerSession } from 'next-auth/next'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Test if NextAuth is working
    const session = await getServerSession(req, res)
    
    res.status(200).json({
      message: 'NextAuth test completed',
      timestamp: new Date().toISOString(),
      session: session ? 'Authenticated' : 'Not authenticated',
      user: session?.user || null,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      databaseUrl: process.env.DATABASE_URL || 'NOT SET'
    })
  } catch (error) {
    console.error('NextAuth test error:', error)
    res.status(500).json({ 
      message: 'NextAuth test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
} 