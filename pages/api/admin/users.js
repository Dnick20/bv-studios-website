import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  // Check admin authentication using NextAuth session
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' })
  }

  try {
    if (req.method === 'GET') {
      // Get all users from database
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              projects: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Transform data to match expected format
      const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        status: 'active', // You can add a status field to your User model
        role: user.role || 'user',
        projects: user._count.projects,
        createdAt: user.createdAt.toISOString().split('T')[0]
      }))
      
      return res.status(200).json({ users: formattedUsers })
    }

    if (req.method === 'POST') {
      // Create new user
      const { name, email, role } = req.body
      
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' })
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' })
      }

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role: role || 'user'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      })

      return res.status(201).json({ 
        user: {
          ...newUser,
          status: 'active',
          projects: 0,
          createdAt: newUser.createdAt.toISOString().split('T')[0]
        }, 
        message: 'User created successfully' 
      })
    }

    if (req.method === 'PUT') {
      // Update user
      const { id, name, email, status, role } = req.body
      
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name: name || existingUser.name,
          email: email || existingUser.email,
          role: role || existingUser.role
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      })

      return res.status(200).json({ 
        user: {
          ...updatedUser,
          status: status || 'active',
          projects: 1, // You can calculate this from actual projects
          createdAt: updatedUser.createdAt.toISOString().split('T')[0]
        }, 
        message: 'User updated successfully' 
      })
    }

    if (req.method === 'DELETE') {
      // Delete user
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Delete user
      await prisma.user.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({ message: 'User deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Admin users API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 