import bcrypt from 'bcryptjs'

// Try to import Prisma, but handle the case where it might not be available
let prisma
try {
  const { prisma: prismaClient } = await import('../../../lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.error('Failed to import Prisma client:', error)
  prisma = null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check if Prisma is available
    if (!prisma) {
      console.error('Prisma client not available')
      return res.status(500).json({ 
        message: 'Database connection not available. Please try again later.',
        error: 'Prisma client not initialized'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    res.status(201).json({
      message: 'User created successfully',
      user
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'User with this email already exists' })
    }
    
    if (error.message.includes('prisma')) {
      return res.status(500).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'Database connection failed'
      })
    }
    
    res.status(500).json({ 
      message: 'Internal server error. Please try again.',
      error: error.message 
    })
  }
} 