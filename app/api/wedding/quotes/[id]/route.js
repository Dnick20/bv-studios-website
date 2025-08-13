import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '../../../../../lib/prisma.js'

export async function PUT(request, { params }) {
  const session = await auth().catch(() => null)
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = params
  const body = await request.json().catch(() => ({}))

  const quote = await prisma.weddingQuote.findUnique({ where: { id } })
  if (!quote) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  if (session.user.role !== 'admin' && quote.userId !== session.user.id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const { status } = body
  const updated = await prisma.weddingQuote.update({ where: { id }, data: { status } })
  return NextResponse.json({ success: true, quote: { id: updated.id, status: updated.status } })
}

export async function DELETE(_request, { params }) {
  const session = await auth().catch(() => null)
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = params
  const quote = await prisma.weddingQuote.findUnique({ where: { id } })
  if (!quote) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  if (session.user.role !== 'admin' && quote.userId !== session.user.id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }
  await prisma.quoteAddon.deleteMany({ where: { quoteId: id } })
  await prisma.weddingQuote.delete({ where: { id } })
  return NextResponse.json({ success: true })
}


