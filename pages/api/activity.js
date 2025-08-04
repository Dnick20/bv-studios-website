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
    // Get user's recent activity
    // In a real app, you'd have an Activity model
    // For now, we'll generate activity based on files and projects
    const files = await prisma.file.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    // Generate activity items
    const activities = []

    // Add file activities
    files.forEach(file => {
      activities.push({
        id: `file-${file.id}`,
        message: `File "${file.name}" uploaded`,
        timestamp: file.createdAt,
        type: 'file'
      })
    })

    // Add project activities
    projects.forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        message: `Project "${project.title}" ${project.status === 'completed' ? 'completed' : 'updated'}`,
        timestamp: project.updatedAt,
        type: 'project'
      })
    })

    // Sort by timestamp and take the most recent 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    activities.splice(10)

    return res.status(200).json({ activities })

  } catch (error) {
    console.error('Activity API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 