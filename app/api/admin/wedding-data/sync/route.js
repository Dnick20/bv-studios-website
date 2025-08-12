import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { WeddingDataBot } from '@/lib/bots/handlers/WeddingDataBot.js'

export async function POST(request) {
  try {
    // Primary auth: NextAuth admin session
    const session = await auth()
    const isAdminSession = !!session && (session.user?.role === 'admin')

    // Fallback auth: static admin API token header (opt-in via env)
    const adminHeaderToken = request.headers.get('x-admin-token') || ''
    const adminEnvToken = process.env.ADMIN_API_TOKEN || ''
    const isTokenAuthorized = Boolean(adminEnvToken) && adminHeaderToken === adminEnvToken

    if (!isAdminSession && !isTokenAuthorized) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const bot = new WeddingDataBot()
    const result = await bot.process({ action: 'sync-defaults' })

    return NextResponse.json({
      message: 'Wedding data sync completed',
      result,
    })
  } catch (error) {
    console.error('WeddingData sync error:', error)
    return NextResponse.json(
      {
        message: 'Failed to sync wedding data',
        error: process.env.NODE_ENV === 'production' ? undefined : String(error?.message || error),
      },
      { status: 500 }
    )
  }
}


