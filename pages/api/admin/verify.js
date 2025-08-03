export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { token } = req.body

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Simple token verification (in production, use JWT)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const [username, timestamp] = decoded.split(':')
      
      // Check if token is not expired (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (tokenAge > maxAge) {
        return res.status(401).json({ message: 'Token expired' })
      }

      if (username !== 'admin') {
        return res.status(401).json({ message: 'Invalid token' })
      }

      res.status(200).json({
        valid: true,
        user: {
          username: 'admin',
          role: 'admin'
        }
      })

    } catch (error) {
      return res.status(401).json({ message: 'Invalid token format' })
    }

  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    })
  }
} 