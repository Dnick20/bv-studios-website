import { NextResponse } from 'next/server'

// In-memory placeholder store for deletes/updates in this mock setup
const deletedIds = new Set()

export async function PUT(_request, { params }) {
  const { id } = params
  // Accept and pretend to update
  if (deletedIds.has(id)) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(_request, { params }) {
  const { id } = params
  deletedIds.add(id)
  return NextResponse.json({ success: true })
}


