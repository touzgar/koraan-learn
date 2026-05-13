import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST bulk actions (mark as read or delete)
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { action, ids } = body

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request. Action and ids array required.' },
        { status: 400 }
      )
    }

    if (action === 'markAsRead') {
      await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      })
      return NextResponse.json({ message: `${ids.length} notifications marked as read` })
    } else if (action === 'delete') {
      await prisma.notification.deleteMany({
        where: { id: { in: ids } },
      })
      return NextResponse.json({ message: `${ids.length} notifications deleted` })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "markAsRead" or "delete".' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
