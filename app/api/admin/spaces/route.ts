import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createNotification, NotificationTemplates } from '@/lib/notifications'

// GET all spaces
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const spaces = await prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(spaces)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 })
  }
}

// POST create new space
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, instructorId, categoryId, status } = body

    if (!title || !instructorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get instructor info for notification
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
      select: { firstName: true, lastName: true }
    })

    const space = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        instructorId,
        categoryId: categoryId || null,
        status: status || 'DRAFT',
        isPublished: status === 'PUBLISHED',
      },
    })

    // Create notification
    if (instructor) {
      const notificationData = status === 'DRAFT' 
        ? NotificationTemplates.draftCourse(space, {
            firstName: instructor.firstName || 'Unknown',
            lastName: instructor.lastName || ''
          })
        : NotificationTemplates.newCourse(space, {
            firstName: instructor.firstName || 'Unknown',
            lastName: instructor.lastName || ''
          })
      
      await createNotification(notificationData)
    }

    return NextResponse.json(space, { status: 201 })
  } catch (error) {
    console.error('Error creating space:', error)
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 })
  }
}
