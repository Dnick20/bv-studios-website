import { getServerSession } from 'next-auth/next'
import { prisma } from '../../lib/prisma'

// Cache for file data to improve performance
const fileCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default async function handler(req, res) {
  // Set CORS headers for better performance
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const session = await getServerSession(req, res)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      // Check cache first
      const cacheKey = `files_${session.user.id}`
      const cached = fileCache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.status(200).json({ files: cached.data })
      }

      const files = await prisma.file.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          type: true,
          size: true,
          url: true,
          createdAt: true,
          updatedAt: true
        }
      })

      // Cache the result
      fileCache.set(cacheKey, {
        data: files,
        timestamp: Date.now()
      })

      res.status(200).json({ files })
    } catch (error) {
      console.error('Error fetching files:', error)
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, url, type, size } = req.body

      if (!name || !url || !type) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const file = await prisma.file.create({
        data: {
          name,
          url,
          type,
          size: size || null,
          userId: session.user.id
        },
        select: {
          id: true,
          name: true,
          type: true,
          size: true,
          url: true,
          createdAt: true,
          updatedAt: true
        }
      })

      // Clear cache for this user
      const cacheKey = `files_${session.user.id}`
      fileCache.delete(cacheKey)

      res.status(201).json({ file })
    } catch (error) {
      console.error('Error creating file:', error)
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
} 