import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

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

  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { category } = req.query
        const where = category && category !== 'all' ? { category } : {}
        
        const media = await prisma.media.findMany({
          where,
          orderBy: { createdAt: 'desc' }
        })
        
        res.status(200).json(media)
      } catch (error) {
        console.error('Error fetching media:', error)
        res.status(500).json({ error: 'Failed to fetch media' })
      }
      break

    case 'POST':
      try {
        const { title, category, url, thumbnail, duration, type } = req.body
        
        const media = await prisma.media.create({
          data: {
            title,
            category,
            url,
            thumbnail,
            duration,
            type
          }
        })
        
        res.status(201).json(media)
      } catch (error) {
        console.error('Error creating media:', error)
        res.status(500).json({ error: 'Failed to create media' })
      }
      break

    case 'DELETE':
      try {
        const { id } = req.query
        
        await prisma.media.delete({
          where: { id: parseInt(id) }
        })
        
        res.status(200).json({ message: 'Media deleted successfully' })
      } catch (error) {
        console.error('Error deleting media:', error)
        res.status(500).json({ error: 'Failed to delete media' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
} 