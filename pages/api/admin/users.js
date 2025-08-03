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
      // Return mock users data
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'client', projects: 3, createdAt: '2024-01-15' },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', status: 'active', role: 'client', projects: 1, createdAt: '2024-01-20' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'pending', role: 'client', projects: 0, createdAt: '2024-01-25' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'active', role: 'client', projects: 2, createdAt: '2024-01-30' }
      ]
      
      return res.status(200).json({ users })
    }

    if (req.method === 'POST') {
      // Create new user
      const { name, email, role } = req.body
      
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' })
      }

      // Mock user creation
      const newUser = {
        id: Date.now(),
        name,
        email,
        status: 'active',
        role: role || 'client',
        projects: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }

      return res.status(201).json({ user: newUser, message: 'User created successfully' })
    }

    if (req.method === 'PUT') {
      // Update user
      const { id, name, email, status, role } = req.body
      
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
      }

      // Mock user update
      const updatedUser = {
        id: parseInt(id),
        name: name || 'Updated User',
        email: email || 'updated@example.com',
        status: status || 'active',
        role: role || 'client',
        projects: 1,
        createdAt: '2024-01-15'
      }

      return res.status(200).json({ user: updatedUser, message: 'User updated successfully' })
    }

    if (req.method === 'DELETE') {
      // Delete user
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
      }

      return res.status(200).json({ message: 'User deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Admin users API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 