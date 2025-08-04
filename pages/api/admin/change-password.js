import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  // Check admin authentication
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' })
  }

  if (session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update the admin user's password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return res.status(200).json({ message: 'Password changed successfully' })

  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 