import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.js'

export async function GET() {
  try {
    const items = await prisma.weddingQuestionnaire.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    return NextResponse.json({ success: true, data: items })
  } catch (e) {
    console.error('Admin Questionnaires GET error:', e)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
