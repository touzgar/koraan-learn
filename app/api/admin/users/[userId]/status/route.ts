import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createNotification, NotificationTemplates } from '@/lib/notifications'

// Toggle user active status (Admin only) - Updated
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Get current user status
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { isActive: true, firstName: true, lastName: true, email: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Toggle active status
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })

    // Create notification if user is deactivated
    if (!updatedUser.isActive) {
      await createNotification(
        NotificationTemplates.inactiveUser(updatedUser)
      )
    }

    return NextResponse.json({
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser,
    })
  } catch (error: any) {
    console.error('Error toggling user status:', error)
    
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}
