import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { category, active } = req.query

    const where = {}
    if (category) {
      where.category = category
    }
    if (active === 'true') {
      where.isActive = true
    }

    const addons = await prisma.weddingAddon.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Format the response to include formatted price
    const formattedAddons = addons.map(addon => ({
      ...addon,
      priceFormatted: `$${(addon.price / 100).toLocaleString()}`
    }))

    return res.status(200).json({ addons: formattedAddons })
  } catch (error) {
    console.error('Addons API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 