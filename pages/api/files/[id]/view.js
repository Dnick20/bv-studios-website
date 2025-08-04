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

    // Set appropriate content type based on file type
    const contentType = getContentType(file.type, file.name)
    res.setHeader('Content-Type', contentType)

    // For images and videos, serve directly
    if (file.type === 'image' || file.type === 'video') {
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)
    } else {
      // For documents, redirect to the file URL
      res.redirect(file.url)
    }

  } catch (error) {
    console.error('File view error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

function getContentType(fileType, filename) {
  const ext = path.extname(filename).toLowerCase()
  
  switch (fileType) {
    case 'image':
      if (['.jpg', '.jpeg'].includes(ext)) return 'image/jpeg'
      if (ext === '.png') return 'image/png'
      if (ext === '.gif') return 'image/gif'
      if (ext === '.webp') return 'image/webp'
      return 'image/jpeg'
    
    case 'video':
      if (ext === '.mp4') return 'video/mp4'
      if (ext === '.avi') return 'video/x-msvideo'
      if (ext === '.mov') return 'video/quicktime'
      if (ext === '.wmv') return 'video/x-ms-wmv'
      return 'video/mp4'
    
    case 'document':
      if (ext === '.pdf') return 'application/pdf'
      if (['.doc', '.docx'].includes(ext)) return 'application/msword'
      if (ext === '.txt') return 'text/plain'
      return 'application/octet-stream'
    
    default:
      return 'application/octet-stream'
  }
} 