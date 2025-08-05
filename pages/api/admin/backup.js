import { backupDatabaseToBackblaze, listBackblazeFiles, BUCKETS } from '../../../lib/backblaze'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../lib/prisma'

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

function verifyAdminToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token']
  if (!token) {
    return false
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret')
    return decoded.role === 'admin'
  } catch (error) {
    return false
  }
}

export default async function handler(req, res) {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (isProduction) {
    return res.status(200).json({
      message: 'Database backup is only available in local development. Use Supabase dashboard for production backups.'
    })
  }

  const { method } = req

  switch (method) {
    case 'POST':
      try {
        // Create new backup
        const result = await backupDatabaseToBackblaze()
        
        if (result.success) {
          res.status(200).json({
            message: 'Database backup created successfully',
            backup: result
          })
        } else {
          res.status(500).json({
            error: 'Failed to create backup',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error creating backup:', error)
        res.status(500).json({ error: 'Failed to create backup' })
      }
      break

    case 'GET':
      try {
        // List existing backups
        const result = await listBackblazeFiles(BUCKETS.backups, 'backups/')
        
        if (result.success) {
          const backups = result.files
            .filter(file => file.Key.endsWith('.db'))
            .map(file => ({
              key: file.Key,
              size: file.Size,
              lastModified: file.LastModified,
              url: `https://${BUCKETS.backups}.s3.us-west-002.backblazeb2.com/${file.Key}`
            }))
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
          
          res.status(200).json({
            backups,
            total: backups.length
          })
        } else {
          res.status(500).json({
            error: 'Failed to list backups',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error listing backups:', error)
        res.status(500).json({ error: 'Failed to list backups' })
      }
      break

    default:
      res.setHeader('Allow', ['POST', 'GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
} 

// pages/api/admin/stats.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch the latest stats
    const stats = await prisma.stats.findFirst({
      orderBy: { updatedAt: 'desc' }
    })
    return res.status(200).json({ stats })
  }
  if (req.method === 'POST') {
    // Update or create stats
    const { totalVideos, happyClients, yearsExperience, clientSatisfaction, completionRate } = req.body
    let stats = await prisma.stats.findFirst()
    if (stats) {
      stats = await prisma.stats.update({
        where: { id: stats.id },
        data: { totalVideos, happyClients, yearsExperience, clientSatisfaction, completionRate }
      })
    } else {
      stats = await prisma.stats.create({
        data: { totalVideos, happyClients, yearsExperience, clientSatisfaction, completionRate }
      })
    }
    return res.status(200).json({ stats })
  }
  return res.status(405).json({ error: 'Method not allowed' })
} 