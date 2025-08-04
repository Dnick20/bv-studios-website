import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../../lib/prisma'
import fs from 'fs'
import path from 'path'

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
    const { id } = req.query

    // Get file info from database
    const file = await prisma.file.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    // Get file path
    const filePath = path.join(process.cwd(), 'public', file.url)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on disk' })
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
    res.setHeader('Content-Type', 'application/octet-stream')

    // Stream the file
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)

  } catch (error) {
    console.error('File download error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 