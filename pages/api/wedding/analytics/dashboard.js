import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Check if user is admin
  if (session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' })
  }

  try {
    // Get date range (last 30 days by default)
    const { startDate, endDate } = req.query
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    // Quote analytics
    const totalQuotes = await prisma.weddingQuote.count({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })

    const approvedQuotes = await prisma.weddingQuote.count({
      where: {
        status: 'approved',
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })

    const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes * 100).toFixed(1) : 0

    // Revenue analytics
    const revenueData = await prisma.weddingQuote.aggregate({
      where: {
        status: 'approved',
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _sum: {
        totalPrice: true
      },
      _avg: {
        totalPrice: true
      }
    })

    const totalRevenue = revenueData._sum.totalPrice || 0
    const averageQuoteValue = revenueData._avg.totalPrice || 0

    // Package popularity
    const packageStats = await prisma.weddingQuote.groupBy({
      by: ['packageId'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        totalPrice: true
      }
    })

    const packageDetails = await Promise.all(
      packageStats.map(async (stat) => {
        const packageInfo = await prisma.weddingPackage.findUnique({
          where: { id: stat.packageId },
          select: { name: true, price: true }
        })
        return {
          packageName: packageInfo?.name || 'Unknown',
          count: stat._count.id,
          revenue: stat._sum.totalPrice || 0
        }
      })
    )

    // Addon popularity
    const addonStats = await prisma.quoteAddon.groupBy({
      by: ['addonId'],
      where: {
        quote: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      },
      _count: {
        id: true
      },
      _sum: {
        price: true
      }
    })

    const addonDetails = await Promise.all(
      addonStats.map(async (stat) => {
        const addonInfo = await prisma.weddingAddon.findUnique({
          where: { id: stat.addonId },
          select: { name: true, category: true }
        })
        return {
          addonName: addonInfo?.name || 'Unknown',
          category: addonInfo?.category || 'Unknown',
          count: stat._count.id,
          revenue: stat._sum.price || 0
        }
      })
    )

    // Venue analytics
    const venueStats = await prisma.weddingQuote.groupBy({
      by: ['venueId'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      }
    })

    const venueDetails = await Promise.all(
      venueStats.map(async (stat) => {
        const venueInfo = await prisma.venue.findUnique({
          where: { id: stat.venueId },
          select: { name: true, city: true }
        })
        return {
          venueName: venueInfo?.name || 'Unknown',
          city: venueInfo?.city || 'Unknown',
          count: stat._count.id
        }
      })
    )

    // Payment analytics
    const paymentStats = await prisma.weddingQuote.groupBy({
      by: ['paymentStatus'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        totalPrice: true
      }
    })

    // Monthly trends
    const monthlyData = await prisma.weddingQuote.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        totalPrice: true
      }
    })

    const monthlyTrends = monthlyData.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      quotes: item._count.id,
      revenue: item._sum.totalPrice || 0
    }))

    res.status(200).json({
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      overview: {
        totalQuotes,
        approvedQuotes,
        conversionRate: `${conversionRate}%`,
        totalRevenue: totalRevenue / 100,
        averageQuoteValue: averageQuoteValue / 100
      },
      packageAnalytics: packageDetails,
      addonAnalytics: addonDetails,
      venueAnalytics: venueDetails,
      paymentAnalytics: paymentStats,
      monthlyTrends
    })

  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ message: 'Error generating analytics' })
  }
} 