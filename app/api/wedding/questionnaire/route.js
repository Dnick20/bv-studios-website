import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.js'

// Fetch the latest questionnaire for the logged-in bride
export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get first quote's wedding date if present
    const firstQuote = await prisma.weddingQuote.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, eventDate: true },
    })

    const questionnaire = await prisma.weddingQuestionnaire.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        questionnaire,
        defaultWeddingDate: firstQuote?.eventDate ?? null,
      },
    })
  } catch (error) {
    console.error('Questionnaire GET error:', error)
    // Gracefully handle missing table in production
    if (error?.code === 'P2021') {
      try {
        const session = await auth().catch(() => null)
        const firstQuote = session?.user?.id
          ? await prisma.weddingQuote.findFirst({
              where: { userId: session.user.id },
              orderBy: { createdAt: 'asc' },
              select: { eventDate: true },
            })
          : null
        return NextResponse.json({
          success: true,
          data: { questionnaire: null, defaultWeddingDate: firstQuote?.eventDate ?? null },
          message: 'Wedding questionnaire not yet set up. Please run database migrations.',
          code: 'P2021',
        })
      } catch {}
    }
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create or update questionnaire
export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      weddingDate,
      responses,
      tag = 'Bride in Kentucky',
      region = 'KY',
    } = body || {}

    const upserted = await prisma.weddingQuestionnaire.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        region,
        tag,
        responses: responses || {},
      },
      update: {
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        region,
        tag,
        responses: responses || {},
      },
    })

    return NextResponse.json({ success: true, data: upserted }, { status: 200 })
  } catch (error) {
    console.error('Questionnaire POST error:', error)
    let message = 'Internal server error'
    if (error?.code === 'P2021') message = 'Wedding questionnaire not yet set up. Please run database migrations.'
    else if (error?.code === 'P2002') message = 'Unique constraint violation while saving questionnaire.'
    else if (error?.code === 'P1001') message = 'Database not reachable. Check DATABASE_URL.'
    return NextResponse.json(
      { success: false, message, code: error?.code || null },
      { status: 500 }
    )
  }
}
