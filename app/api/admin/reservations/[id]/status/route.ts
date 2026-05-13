import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createNotification, NotificationTemplates } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

// PATCH update reservation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get enrollment info for notification
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: { firstName: true, lastName: true }
        },
        course: {
          select: { title: true }
        }
      }
    })

    const updateData: any = { status }

    // If status is COMPLETED, set completedAt and progress to 100
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
      updateData.progress = 100
    }

    // If status is CANCELLED, reset progress
    if (status === 'CANCELLED') {
      updateData.progress = 0
    }

    const reservation = await prisma.enrollment.update({
      where: { id: params.id },
      data: updateData,
    })

    // Create notification based on status
    if (enrollment) {
      if (status === 'COMPLETED') {
        await createNotification(
          NotificationTemplates.completedEnrollment(
            {
              firstName: enrollment.student.firstName || 'Unknown',
              lastName: enrollment.student.lastName || ''
            },
            enrollment.course,
            reservation.id
          )
        )
      } else if (status === 'CANCELLED') {
        await createNotification(
          NotificationTemplates.cancelledEnrollment(
            {
              firstName: enrollment.student.firstName || 'Unknown',
              lastName: enrollment.student.lastName || ''
            },
            enrollment.course,
            reservation.id
          )
        )
      }
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error updating reservation status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
