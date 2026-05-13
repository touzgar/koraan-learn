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

    // Get student enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
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
            lessons: true,
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      }
    })

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: { studentId: user.id }
    })

    // Calculate stats
    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(e => e.progress === 100).length
    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0

    // Get active courses (in progress)
    const activeCourses = enrollments
      .filter(e => e.progress > 0 && e.progress < 100)
      .slice(0, 3)
      .map(e => ({
        id: e.course.id,
        title: e.course.title,
        instructor: `${e.course.instructor.firstName} ${e.course.instructor.lastName}`,
        progress: e.progress,
        thumbnail: e.course.imageUrl,
        category: e.course.category?.name || 'General',
        totalLessons: e.course._count.lessons,
        enrolledAt: e.enrolledAt
      }))

    return NextResponse.json({
      stats: {
        totalCourses,
        completedCourses,
        certificates: certificates.length,
        avgProgress
      },
      activeCourses,
      user: {
        firstName: user.firstName,
        lastName: user.lastName
      }
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
