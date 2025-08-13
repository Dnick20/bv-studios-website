import { auth } from '@/lib/auth'
import { prisma } from '../../../../lib/prisma.js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const session = await auth().catch(() => null)
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const quotes = await prisma.weddingQuote.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      package: true,
      venue: true,
      user: { select: { id: true, name: true, email: true } },
      quoteAddons: { include: { addon: true } },
    },
  })

  const shaped = quotes.map((q) => ({
    id: q.id,
    status: q.status,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    eventDate: q.eventDate,
    eventTime: q.eventTime,
    totalPrice: q.totalPrice,
    specialRequests: q.specialRequests || '',
    paymentStatus: q.paymentStatus || null,
    user: q.user,
    package: {
      id: q.package.id,
      name: q.package.name,
      price: q.package.price,
      duration: q.package.duration,
      features: (() => {
        try {
          return JSON.parse(q.package.features)
        } catch {
          return []
        }
      })(),
    },
    venue: q.venue
      ? { id: q.venue.id, name: q.venue.name }
      : q.venueName
      ? { name: q.venueName }
      : null,
    quoteAddons: q.quoteAddons.map((qa) => ({
      id: qa.id,
      addon: {
        id: qa.addon.id,
        name: qa.addon.name,
        price: qa.price ?? qa.addon.price,
      },
    })),
  }))

  return NextResponse.json({ success: true, quotes: shaped })
}
