import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student's enrolled courses with lessons
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        course: {
          include: {
            lessons: {
              where: {
                isPublished: true,
              },
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    })

    const events: any[] = []
    const now = new Date()

    // Create events from lessons
    enrollments.forEach((enrollment) => {
      enrollment.course.lessons.forEach((lesson, index) => {
        const eventDate = new Date(now)
        eventDate.setDate(now.getDate() + index)
        
        events.push({
          id: `lesson-${lesson.id}`,
          title: lesson.title,
          type: 'lesson',
          course: enrollment.course.title,
          date: eventDate.toISOString(),
          time: '10:00 AM',
          duration: lesson.duration || 60,
          color: 'emerald',
          description: lesson.description?.substring(0, 100) || '',
        })
      })
    })

    // Sort events by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar' },
      { status: 500 }
    )
  }
}
