export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    res.status(200).json({ 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    })
  } catch (error) {
    console.error('Test API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
} 