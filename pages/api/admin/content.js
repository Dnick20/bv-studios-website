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
        const { page } = req.query
        const content = await prisma.content.findFirst({
          where: { page }
        })
        
        res.status(200).json(content || {})
      } catch (error) {
        console.error('Error fetching content:', error)
        res.status(500).json({ error: 'Failed to fetch content' })
      }
      break

    case 'POST':
    case 'PUT':
      try {
        const { page, data } = req.body
        
        const content = await prisma.content.upsert({
          where: { page },
          update: { data },
          create: { page, data }
        })
        
        res.status(200).json(content)
      } catch (error) {
        console.error('Error saving content:', error)
        res.status(500).json({ error: 'Failed to save content' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
} 