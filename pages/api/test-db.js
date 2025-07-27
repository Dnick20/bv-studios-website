// Try to import Prisma, but handle the case where it might not be available
let prisma
try {
  const { prisma: prismaClient } = await import('../../lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.error('Failed to import Prisma client:', error)
  prisma = null
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    if (!prisma) {
      return res.status(500).json({ 
        message: 'Prisma client not available',
        error: 'Database connection failed'
      })
    }

    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    res.status(200).json({ 
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      test: result
    })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message 
    })
  }
} 