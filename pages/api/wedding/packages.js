import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { active } = req.query

    const where = {}
    if (active === 'true') {
      where.isActive = true
    }

    const packages = await prisma.weddingPackage.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Format the response to include parsed features
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      features: JSON.parse(pkg.features),
      priceFormatted: `$${(pkg.price / 100).toLocaleString()}`
    }))

    return res.status(200).json({ packages: formattedPackages })
  } catch (error) {
    console.error('Packages API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 