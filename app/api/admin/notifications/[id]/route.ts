import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// DELETE notification
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ message: 'Route temporarily disabled for debugging' }, { status: 503 })
}

// PATCH mark as read
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ message: 'Route temporarily disabled for debugging' }, { status: 503 })
}
