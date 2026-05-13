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

    // Get student's enrollments for course-related notifications
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
    })

    const notifications: any[] = []

    // Create notifications from enrollments
    enrollments.forEach((enrollment) => {
      // Progress milestone notifications
      if (enrollment.progress === 100) {
        notifications.push({
          id: `completion-${enrollment.id}`,
          type: 'completion',
          title: 'Course Completed! 🎉',
          message: `Congratulations! You've completed "${enrollment.course.title}"`,
          time: formatTimeAgo(enrollment.updatedAt),
          read: false,
          icon: 'Award',
          color: 'amber',
          date: enrollment.updatedAt,
        })
      } else if (enrollment.progress >= 50 && enrollment.progress < 100) {
        notifications.push({
          id: `progress-${enrollment.id}`,
          type: 'achievement',
          title: 'Halfway There!',
          message: `You're ${enrollment.progress}% through "${enrollment.course.title}"`,
          time: formatTimeAgo(enrollment.updatedAt),
          read: false,
          icon: 'TrendingUp',
          color: 'emerald',
          date: enrollment.updatedAt,
        })
      }

      // New enrollment notification
      if (isRecent(enrollment.enrolledAt, 7)) {
        notifications.push({
          id: `enroll-${enrollment.id}`,
          type: 'course',
          title: 'Welcome to the Course!',
          message: `You've enrolled in "${enrollment.course.title}" by ${enrollment.course.instructor.firstName || 'Unknown'} ${enrollment.course.instructor.lastName || ''}`,
          time: formatTimeAgo(enrollment.enrolledAt),
          read: false,
          icon: 'BookOpen',
          color: 'teal',
          date: enrollment.enrolledAt,
        })
      }
    })

    // Sort by date (most recent first)
    notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ 
      notifications: notifications.slice(0, 20),
      unreadCount: notifications.filter(n => !n.read).length,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return new Date(date).toLocaleDateString()
}

function isRecent(date: Date, days: number): boolean {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  return diffDays <= days
}
