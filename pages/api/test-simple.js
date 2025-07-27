export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    res.status(200).json({
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      url: req.url,
      method: req.method
    })
  } catch (error) {
    console.error('Simple test error:', error)
    res.status(500).json({ 
      message: 'Simple test failed',
      error: error.message 
    })
  }
} 