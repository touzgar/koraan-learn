import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: 'Course not found or not available' }, { status: 404 })
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 })
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: user.id,
        courseId: courseId,
        status: 'ACTIVE',
        progress: 0
      }
    })

    // Create notification for new enrollment
    await prisma.notification.create({
      data: {
        type: 'NEW_ENROLLMENT',
        title: 'New Enrollment',
        description: `Student enrolled in ${course.title}`,
        entityId: enrollment.id,
        entityType: 'enrollment'
      }
    })

    return NextResponse.json({ 
      success: true,
      enrollment 
    })
  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    )
  }
}
