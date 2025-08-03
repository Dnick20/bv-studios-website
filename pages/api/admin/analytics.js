export default async function handler(req, res) {
  // Check admin authentication
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  
  try {
    // Verify admin token (simplified for demo)
    const decoded = Buffer.from(token, 'base64').toString()
    if (!decoded.includes('admin:')) {
      return res.status(401).json({ message: 'Invalid admin token' })
    }

    if (req.method === 'GET') {
      const { type } = req.query

      if (type === 'revenue') {
        // Mock revenue analytics
        const revenueData = {
          monthly: [
            { month: 'Jan', revenue: 12500 },
            { month: 'Feb', revenue: 18750 },
            { month: 'Mar', revenue: 15600 },
            { month: 'Apr', revenue: 22300 },
            { month: 'May', revenue: 19800 },
            { month: 'Jun', revenue: 24500 }
          ],
          total: 113450,
          growth: 23.5
        }
        return res.status(200).json(revenueData)
      }

      if (type === 'projects') {
        // Mock project analytics
        const projectData = {
          byStatus: [
            { status: 'completed', count: 12, percentage: 40 },
            { status: 'in-progress', count: 8, percentage: 27 },
            { status: 'pending', count: 10, percentage: 33 }
          ],
          byType: [
            { type: 'Wedding', count: 15, revenue: 37500 },
            { type: 'Commercial', count: 8, revenue: 40000 },
            { type: 'Event', count: 5, revenue: 15000 },
            { type: 'Real Estate', count: 2, revenue: 3600 }
          ],
          completionRate: 85.2
        }
        return res.status(200).json(projectData)
      }

      if (type === 'users') {
        // Mock user analytics
        const userData = {
          total: 156,
          active: 142,
          newThisMonth: 23,
          growth: 18.5,
          byRole: [
            { role: 'client', count: 145, percentage: 93 },
            { role: 'admin', count: 2, percentage: 1.3 },
            { role: 'staff', count: 9, percentage: 5.7 }
          ]
        }
        return res.status(200).json(userData)
      }

      // Default analytics overview
      const overview = {
        totalRevenue: 113450,
        totalProjects: 30,
        totalUsers: 156,
        completionRate: 85.2,
        averageProjectValue: 3782,
        monthlyGrowth: 23.5
      }
      
      return res.status(200).json(overview)
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Admin analytics API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 