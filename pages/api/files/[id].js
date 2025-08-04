import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  // Check user authentication
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (req.method !== 'DELETE') {
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

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', file.url)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete file record from database
    await prisma.file.delete({
      where: {
        id: id
      }
    })

    return res.status(200).json({ message: 'File deleted successfully' })

  } catch (error) {
    console.error('File deletion error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 