import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student's enrolled courses with their lessons
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        course: {
          include: {
            lessons: {
              where: {
                published: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    const lessons: any[] = []

    enrollments.forEach((enrollment) => {
      enrollment.course.lessons.forEach((lesson) => {
        lessons.push({
          id: lesson.id,
          title: lesson.title,
          content: lesson.content,
          duration: lesson.duration || 60,
          order: lesson.order,
          videoUrl: lesson.videoUrl,
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
          },
          completed: false, // You can track this in a separate table if needed
        })
      })
    })

    // Sort by course and order
    lessons.sort((a, b) => {
      if (a.course.id === b.course.id) {
        return a.order - b.order
      }
      return a.course.title.localeCompare(b.course.title)
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}
