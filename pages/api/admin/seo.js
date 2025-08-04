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
        const seoSettings = await prisma.seoSettings.findFirst()
        res.status(200).json(seoSettings || {})
      } catch (error) {
        console.error('Error fetching SEO settings:', error)
        res.status(500).json({ error: 'Failed to fetch SEO settings' })
      }
      break

    case 'POST':
    case 'PUT':
      try {
        const {
          siteTitle,
          siteDescription,
          keywords,
          ogImage,
          twitterCard,
          googleAnalytics,
          googleTagManager,
          structuredData
        } = req.body
        
        const seoSettings = await prisma.seoSettings.upsert({
          where: { id: 1 },
          update: {
            siteTitle,
            siteDescription,
            keywords,
            ogImage,
            twitterCard,
            googleAnalytics,
            googleTagManager,
            structuredData
          },
          create: {
            id: 1,
            siteTitle,
            siteDescription,
            keywords,
            ogImage,
            twitterCard,
            googleAnalytics,
            googleTagManager,
            structuredData
          }
        })
        
        res.status(200).json(seoSettings)
      } catch (error) {
        console.error('Error saving SEO settings:', error)
        res.status(500).json({ error: 'Failed to save SEO settings' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
} 