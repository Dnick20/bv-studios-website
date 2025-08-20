import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma.js'

export async function GET() {
  try {
    // Get basic statistics for admin dashboard
    const [totalUsers, totalProjects, totalWeddingQuotes, totalVideos] =
      await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.weddingQuote.count(),
        // For videos, we'll use a placeholder since we don't have a video model yet
        Promise.resolve(0),
      ])

    const stats = {
      totalUsers,
      totalProjects,
      totalWeddingQuotes,
      totalVideos,
      clientSatisfaction: 95, // Placeholder - could be calculated from reviews
      recentActivity: {
        newUsers: totalUsers > 0 ? Math.floor(totalUsers * 0.1) : 0,
        newProjects: totalProjects > 0 ? Math.floor(totalProjects * 0.15) : 0,
        newQuotes:
          totalWeddingQuotes > 0 ? Math.floor(totalWeddingQuotes * 0.2) : 0,
      },
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch admin statistics',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
