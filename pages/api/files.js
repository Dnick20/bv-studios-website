import { getServerSession } from 'next-auth/next'
import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const files = await prisma.file.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      res.status(200).json({ files })
    } catch (error) {
      console.error('Error fetching files:', error)
      res.status(500).json({ message: 'Internal server error' })
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
        }
      })

      res.status(201).json({ file })
    } catch (error) {
      console.error('Error creating file:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
} 