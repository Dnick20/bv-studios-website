import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma.js'

export async function GET(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const isAdmin = session.user?.role === 'admin'

    const whereBase = {
      ...(status ? { status } : {}),
      ...(isAdmin ? {} : { userId: session.user.id }),
    }

    const quotes = await prisma.weddingQuote.findMany({
      where: whereBase,
      orderBy: { createdAt: 'desc' },
      include: {
        package: true,
        venue: true,
        quoteAddons: { include: { addon: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    // Shape to frontend expectations
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
          try { return JSON.parse(q.package.features) } catch { return [] }
        })(),
      },
      venue: q.venue ? { id: q.venue.id, name: q.venue.name } : q.venueName ? { name: q.venueName } : null,
      quoteAddons: q.quoteAddons.map((qa) => ({
        id: qa.id,
        addon: { id: qa.addon.id, name: qa.addon.name, price: qa.price ?? qa.addon.price },
      })),
    }))

    return NextResponse.json({ success: true, quotes: shaped })
  } catch (error) {
    console.error('Wedding Quotes API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await auth().catch(() => null)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const isBookingPayload =
      'packageId' in body || 'eventDate' in body || 'venueName' in body

    if (!isBookingPayload) {
      return NextResponse.json(
        { message: 'Invalid payload' },
        { status: 400 }
      )
    }

    const pkg = await prisma.weddingPackage.findUnique({
      where: { id: String(body.packageId) },
    })
    if (!pkg) {
      return NextResponse.json(
        { message: 'Package not found' },
        { status: 400 }
      )
    }

    // Resolve addons from DB
    const addonIds = Array.isArray(body.addons)
      ? body.addons.map((a) => String(a.addonId))
      : []
    const addons = addonIds.length
      ? await prisma.weddingAddon.findMany({ where: { id: { in: addonIds } } })
      : []

    const addonsWithPrice = Array.isArray(body.addons)
      ? body.addons.map((a) => {
          const db = addons.find((x) => x.id === String(a.addonId))
          const price = Number(a.price ?? db?.price ?? 0)
          return { addonId: String(a.addonId), price }
        })
      : []

    const totalPrice =
      Number(pkg.price) + addonsWithPrice.reduce((s, x) => s + Number(x.price), 0)

    const created = await prisma.weddingQuote.create({
      data: {
        userId: session.user.id,
        packageId: String(body.packageId),
        eventDate: new Date(body.eventDate),
        eventTime: body.eventTime,
        venueId: body.venueId ? String(body.venueId) : null,
        venueName: body.venueId ? null : body.venueName || null,
        guestCount: body.guestCount ? Number(body.guestCount) : null,
        specialRequests: body.specialRequests || null,
        status: 'pending',
        totalPrice,
        quoteAddons: {
          create: addonsWithPrice.map((a) => ({ addonId: a.addonId, price: a.price })),
        },
      },
      include: {
        package: true,
        venue: true,
        quoteAddons: { include: { addon: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    const shaped = {
      id: created.id,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      eventDate: created.eventDate,
      eventTime: created.eventTime,
      totalPrice: created.totalPrice,
      specialRequests: created.specialRequests || '',
      user: created.user,
      package: {
        id: created.package.id,
        name: created.package.name,
        price: created.package.price,
        duration: created.package.duration,
        features: (() => { try { return JSON.parse(created.package.features) } catch { return [] } })(),
      },
      venue: created.venue ? { id: created.venue.id, name: created.venue.name } : created.venueName ? { name: created.venueName } : null,
      quoteAddons: created.quoteAddons.map((qa) => ({ id: qa.id, addon: { id: qa.addon.id, name: qa.addon.name, price: qa.price } })),
    }

    return NextResponse.json({ success: true, quote: shaped }, { status: 201 })
  } catch (error) {
    console.error('Wedding Quotes API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
