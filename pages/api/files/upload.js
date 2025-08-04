import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  // Check user authentication
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('File upload error:', err)
        return res.status(500).json({ message: 'File upload failed' })
      }

      const file = files.file?.[0]
      if (!file) {
        return res.status(400).json({ message: 'No file provided' })
      }

      try {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Determine file type
        const fileType = getFileType(file.originalFilename || file.newFilename)

        // Save file info to database
        const savedFile = await prisma.file.create({
          data: {
            name: file.originalFilename || file.newFilename,
            url: `/uploads/${file.newFilename}`,
            type: fileType,
            size: file.size,
            userId: session.user.id
          }
        })

        return res.status(200).json({ 
          message: 'File uploaded successfully',
          file: savedFile
        })

      } catch (error) {
        console.error('Database save error:', error)
        return res.status(500).json({ message: 'Failed to save file info' })
      }
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase()
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return 'image'
  } else if (['.mp4', '.avi', '.mov', '.wmv'].includes(ext)) {
    return 'video'
  } else if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
    return 'document'
  } else {
    return 'other'
  }
} 