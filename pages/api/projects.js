import { getServerSession } from 'next-auth/next'
import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  // Check user authentication
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get user's projects
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        budget: true,
        progress: true,
        startDate: true,
        endDate: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({ projects })

  } catch (error) {
    console.error('Projects API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 