import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  // Check admin authentication
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Generate backup ID
    const backupId = `backup-${Date.now()}`
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Get all data from database
    const users = await prisma.user.findMany()
    const projects = await prisma.project.findMany()
    const files = await prisma.file.findMany()
    const payments = await prisma.payment.findMany()
    const subscriptions = await prisma.subscription.findMany()

    // Create backup data
    const backupData = {
      backupId,
      timestamp: new Date().toISOString(),
      data: {
        users,
        projects,
        files,
        payments,
        subscriptions
      }
    }

    // Save backup to file
    const backupPath = path.join(backupDir, `${backupId}.json`)
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))

    // In a real application, you might also:
    // - Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // - Send to external backup service
    // - Create database dump file
    // - Compress the backup

    return res.status(200).json({ 
      message: 'Database backup created successfully',
      backupId,
      backupPath: backupPath,
      recordCount: {
        users: users.length,
        projects: projects.length,
        files: files.length,
        payments: payments.length,
        subscriptions: subscriptions.length
      }
    })

  } catch (error) {
    console.error('Backup error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 