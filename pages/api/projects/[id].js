import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      // Check if project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: id,
          userId: session.user.id
        }
      })

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      // Delete project
      await prisma.project.delete({
        where: { id: id }
      })

      return res.status(200).json({ message: 'Project deleted successfully' })
    } catch (error) {
      console.error('Delete project error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: id,
          userId: session.user.id
        },
        include: {
          files: true
        }
      })

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      return res.status(200).json({ project })
    } catch (error) {
      console.error('Get project error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, budget, status, progress } = req.body

      const project = await prisma.project.findFirst({
        where: {
          id: id,
          userId: session.user.id
        }
      })

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      const updatedProject = await prisma.project.update({
        where: { id: id },
        data: {
          title: title || project.title,
          description: description || project.description,
          budget: budget || project.budget,
          status: status || project.status,
          progress: progress || project.progress
        }
      })

      return res.status(200).json({ project: updatedProject })
    } catch (error) {
      console.error('Update project error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
} 