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

    // Get courses the student is already enrolled in
    const enrolledCourses = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      select: { courseId: true }
    })

    const enrolledCourseIds = enrolledCourses.map(e => e.courseId)

    // Get all published courses that the student is NOT enrolled in
    const availableCourses = await prisma.course.findMany({
      where: {
        AND: [
          { isPublished: true },
          { status: 'PUBLISHED' },
          { id: { notIn: enrolledCourseIds } }
        ]
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const courses = availableCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
      imageUrl: course.imageUrl,
      category: course.category?.name || 'General',
      totalLessons: course._count.lessons,
      price: course.price,
      enrolledCount: course._count.enrollments,
      isEnrolled: false
    }))

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Available courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available courses' },
      { status: 500 }
    )
  }
}
