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
      // Return mock projects data
      const projects = [
        { 
          id: 1, 
          title: 'Wedding Video - Sarah & Mike', 
          client: 'Sarah Smith', 
          status: 'completed', 
          budget: 2500, 
          progress: 100,
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          description: 'Full wedding coverage including ceremony and reception'
        },
        { 
          id: 2, 
          title: 'Commercial Project - ABC Corp', 
          client: 'John Doe', 
          status: 'in-progress', 
          budget: 5000, 
          progress: 65,
          startDate: '2024-02-01',
          endDate: '2024-03-15',
          description: 'Corporate promotional video for new product launch'
        },
        { 
          id: 3, 
          title: 'Event Coverage - Tech Conference', 
          client: 'Mike Johnson', 
          status: 'pending', 
          budget: 3000, 
          progress: 0,
          startDate: '2024-03-01',
          endDate: '2024-03-05',
          description: 'Multi-day technology conference documentation'
        },
        { 
          id: 4, 
          title: 'Real Estate Video - Luxury Home', 
          client: 'Emily Davis', 
          status: 'in-progress', 
          budget: 1800, 
          progress: 40,
          startDate: '2024-02-10',
          endDate: '2024-02-25',
          description: 'Professional real estate marketing video'
        }
      ]
      
      return res.status(200).json({ projects })
    }

    if (req.method === 'POST') {
      // Create new project
      const { title, client, budget, description, startDate, endDate } = req.body
      
      if (!title || !client || !budget) {
        return res.status(400).json({ message: 'Title, client, and budget are required' })
      }

      // Mock project creation
      const newProject = {
        id: Date.now(),
        title,
        client,
        status: 'pending',
        budget: parseInt(budget),
        progress: 0,
        description: description || '',
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      return res.status(201).json({ project: newProject, message: 'Project created successfully' })
    }

    if (req.method === 'PUT') {
      // Update project
      const { id, title, client, status, budget, progress, description } = req.body
      
      if (!id) {
        return res.status(400).json({ message: 'Project ID is required' })
      }

      // Mock project update
      const updatedProject = {
        id: parseInt(id),
        title: title || 'Updated Project',
        client: client || 'Updated Client',
        status: status || 'in-progress',
        budget: budget || 2000,
        progress: progress || 50,
        description: description || 'Updated project description',
        startDate: '2024-01-15',
        endDate: '2024-03-15'
      }

      return res.status(200).json({ project: updatedProject, message: 'Project updated successfully' })
    }

    if (req.method === 'DELETE') {
      // Delete project
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ message: 'Project ID is required' })
      }

      return res.status(200).json({ message: 'Project deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Admin projects API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 