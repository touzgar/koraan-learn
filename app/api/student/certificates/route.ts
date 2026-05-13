import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all completed enrollments with course details
    const completedEnrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
        progress: 100,
      },
      include: {
        course: {
          include: {
            instructor: true,
            category: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const certificates = completedEnrollments.map((enrollment) => ({
      id: enrollment.id,
      course: enrollment.course.title,
      instructor: `${enrollment.course.instructor.firstName || 'Unknown'} ${enrollment.course.instructor.lastName || ''}`,
      completedDate: enrollment.updatedAt,
      certificateUrl: null,
      certificateNumber: `CERT-${enrollment.id.slice(0, 8).toUpperCase()}`,
      courseId: enrollment.course.id,
      description: enrollment.course.description,
      category: enrollment.course.category?.name || 'Uncategorized',
    }))

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}
