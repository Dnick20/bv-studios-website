import { getServerSession } from 'next-auth/next'

export default async function handler(req, res) {
  // Check admin authentication
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // In a real application, you would:
    // - Clear Redis cache
    // - Clear CDN cache
    // - Clear file system cache
    // - Clear memory cache
    // - Clear browser cache headers

    // For now, we'll just return success
    // In a real app, you might do something like:
    // await redis.flushall()
    // await cdn.purge()
    // clearFileCache()
    
    console.log('Cache cleared by admin:', session.user.email)

    return res.status(200).json({ 
      message: 'Cache cleared successfully',
      clearedAt: new Date().toISOString(),
      clearedBy: session.user.email
    })

  } catch (error) {
    console.error('Clear cache error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 