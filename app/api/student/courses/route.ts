import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student enrollments with course details
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
            _count: {
              select: {
                lessons: true
              }
            }
          }
        },
        lessonProgress: {
          where: {
            isCompleted: true
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    })

    const courses = enrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
      progress: enrollment.progress,
      imageUrl: enrollment.course.imageUrl,
      category: enrollment.course.category?.name || 'General',
      totalLessons: enrollment.course._count.lessons,
      completedLessons: enrollment.lessonProgress.length,
      status: enrollment.progress === 100 ? 'completed' : 'in-progress',
      enrolledAt: enrollment.enrolledAt.toISOString()
    }))

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
