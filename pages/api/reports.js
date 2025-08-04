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
    // Get user's files and projects for report generation
    const files = await prisma.file.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    // Generate reports based on data
    const reports = []

    // File usage report
    if (files.length > 0) {
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
      const fileTypes = files.reduce((acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1
        return acc
      }, {})

      reports.push({
        id: 'file-usage',
        title: 'File Usage Report',
        description: `${files.length} files, ${formatFileSize(totalSize)} total`,
        date: new Date().toISOString().split('T')[0],
        type: 'file-usage',
        data: {
          totalFiles: files.length,
          totalSize,
          fileTypes
        }
      })
    }

    // Project status report
    if (projects.length > 0) {
      const completedProjects = projects.filter(p => p.status === 'completed').length
      const activeProjects = projects.filter(p => p.status === 'in-progress').length
      const pendingProjects = projects.filter(p => p.status === 'pending').length

      reports.push({
        id: 'project-status',
        title: 'Project Status Report',
        description: `${completedProjects} completed, ${activeProjects} active, ${pendingProjects} pending`,
        date: new Date().toISOString().split('T')[0],
        type: 'project-status',
        data: {
          totalProjects: projects.length,
          completed: completedProjects,
          active: activeProjects,
          pending: pendingProjects
        }
      })
    }

    // Storage report
    if (files.length > 0) {
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
      const storageLimit = 10 * 1024 * 1024 * 1024 // 10GB
      const usagePercentage = (totalSize / storageLimit) * 100

      reports.push({
        id: 'storage-usage',
        title: 'Storage Usage Report',
        description: `${formatFileSize(totalSize)} used of ${formatFileSize(storageLimit)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'storage-usage',
        data: {
          used: totalSize,
          limit: storageLimit,
          percentage: usagePercentage
        }
      })
    }

    return res.status(200).json({ reports })

  } catch (error) {
    console.error('Reports API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
} 