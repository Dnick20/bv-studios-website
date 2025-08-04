import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    // Hardcoded admin credentials
    const ADMIN_USERNAME = 'admin'
    const ADMIN_PASSWORD = 'dominic20'

    // Check credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    // Return the real ADMIN_TOKEN from env
    const adminToken = process.env.ADMIN_TOKEN || 'admin-token'

    res.status(200).json({
      message: 'Admin login successful',
      token: adminToken,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    })
  }
} 