import { prisma } from '../../../lib/prisma'

function verifyAdminToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token']
  if (!token) return null
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) {
    return { role: 'admin' }
  }
  return null
}

export default async function handler(req, res) {
  // Check admin authentication using token
  const adminUser = verifyAdminToken(req)
  
  if (!adminUser || adminUser.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized - Admin access required' })
  }

  try {
    if (req.method === 'GET') {
      // Get all projects from database
      const projects = await prisma.project.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Transform data to match expected format
      const formattedProjects = projects.map(project => ({
        id: project.id,
        title: project.title,
        client: project.user?.name || 'Unknown Client',
        status: project.status || 'pending',
        budget: project.budget || 0,
        progress: project.progress || 0,
        startDate: project.startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: project.endDate?.toISOString().split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: project.description || ''
      }))
      
      return res.status(200).json({ projects: formattedProjects })
    }

    if (req.method === 'POST') {
      // Create new project
      const { title, client, budget, description, startDate, endDate } = req.body
      
      if (!title || !client || !budget) {
        return res.status(400).json({ message: 'Title, client, and budget are required' })
      }

      // Find user by name (you might want to change this to use user ID)
      const user = await prisma.user.findFirst({
        where: { name: client }
      })

      if (!user) {
        return res.status(400).json({ message: 'Client not found' })
      }

      // Create new project
      const newProject = await prisma.project.create({
        data: {
          title,
          description: description || '',
          budget: parseInt(budget),
          status: 'pending',
          progress: 0,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          userId: user.id
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      return res.status(201).json({ 
        project: {
          id: newProject.id,
          title: newProject.title,
          client: newProject.user?.name || 'Unknown Client',
          status: newProject.status,
          budget: newProject.budget,
          progress: newProject.progress,
          startDate: newProject.startDate.toISOString().split('T')[0],
          endDate: newProject.endDate.toISOString().split('T')[0],
          description: newProject.description
        }, 
        message: 'Project created successfully' 
      })
    }

    if (req.method === 'PUT') {
      // Update project
      const { id, title, client, status, budget, progress, description } = req.body
      
      if (!id) {
        return res.status(400).json({ message: 'Project ID is required' })
      }

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (!existingProject) {
        return res.status(404).json({ message: 'Project not found' })
      }

      // Update project
      const updatedProject = await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          title: title || existingProject.title,
          description: description || existingProject.description,
          budget: budget ? parseInt(budget) : existingProject.budget,
          status: status || existingProject.status,
          progress: progress ? parseInt(progress) : existingProject.progress
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      return res.status(200).json({ 
        project: {
          id: updatedProject.id,
          title: updatedProject.title,
          client: updatedProject.user?.name || 'Unknown Client',
          status: updatedProject.status,
          budget: updatedProject.budget,
          progress: updatedProject.progress,
          startDate: updatedProject.startDate.toISOString().split('T')[0],
          endDate: updatedProject.endDate.toISOString().split('T')[0],
          description: updatedProject.description
        }, 
        message: 'Project updated successfully' 
      })
    }

    if (req.method === 'DELETE') {
      // Delete project
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ message: 'Project ID is required' })
      }

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existingProject) {
        return res.status(404).json({ message: 'Project not found' })
      }

      // Delete project
      await prisma.project.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({ message: 'Project deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Admin projects API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 