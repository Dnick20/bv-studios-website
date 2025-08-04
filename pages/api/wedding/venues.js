import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { search, city, state, active } = req.query

    const where = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (city) {
      where.city = city
    }
    if (state) {
      where.state = state
    }
    if (active === 'true') {
      where.isActive = true
    }

    const venues = await prisma.venue.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    return res.status(200).json({ venues })
  } catch (error) {
    console.error('Venues API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 