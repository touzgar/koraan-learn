import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createNotification, NotificationTemplates } from '@/lib/notifications'

// PATCH update space status
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

    if (!status || !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get course info for notification
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    const space = await prisma.course.update({
      where: { id: params.id },
      data: {
        status,
        isPublished: status === 'PUBLISHED',
      },
    })

    // Create notification when status changes to PUBLISHED
    if (status === 'PUBLISHED' && course) {
      await createNotification(
        NotificationTemplates.newCourse(
          { title: course.title, id: space.id },
          course.instructor
        )
      )
    }

    return NextResponse.json(space)
  } catch (error) {
    console.error('Error updating status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
