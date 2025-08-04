import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'
import { authenticator } from 'otplib'

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
    // Generate a secret for 2FA
    const secret = authenticator.generateSecret()
    
    // Generate QR code URL
    const otpauth = authenticator.keyuri(session.user.email, 'BV Studios Admin', secret)
    
    // Store the secret in the user's metadata (in a real app, you'd want to encrypt this)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        metadata: JSON.stringify({
          twoFactorSecret: secret,
          twoFactorEnabled: true
        })
      }
    })

    return res.status(200).json({ 
      message: '2FA enabled successfully',
      qrCode: otpauth,
      secret: secret // In production, you'd only return this once
    })

  } catch (error) {
    console.error('Enable 2FA error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 