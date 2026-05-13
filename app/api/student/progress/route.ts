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

    // Get all enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          select: {
            title: true,
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
      }
    })

    // Calculate overall progress
    const totalCourses = enrollments.length
    const avgProgress = totalCourses > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0

    // Calculate streak (simplified - days with activity in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        enrollment: {
          studentId: user.id
        },
        updatedAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        updatedAt: true
      }
    })

    // Count unique days with activity
    const uniqueDays = new Set(
      recentProgress.map(p => p.updatedAt.toISOString().split('T')[0])
    )
    const currentStreak = uniqueDays.size

    // Weekly activity (last 7 days)
    const weeklyActivity = []
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayStr = date.toISOString().split('T')[0]
      
      const dayProgress = recentProgress.filter(p => 
        p.updatedAt.toISOString().split('T')[0] === dayStr
      )
      
      // Estimate hours (each lesson progress = ~0.5 hours)
      const hours = Math.round((dayProgress.length * 0.5) * 10) / 10
      
      weeklyActivity.push({
        day: days[date.getDay()],
        hours: hours
      })
    }

    // Course progress details
    const courseProgress = enrollments.map(enrollment => ({
      course: enrollment.course.title,
      progress: enrollment.progress,
      lessons: enrollment.lessonProgress.length,
      total: enrollment.course._count.lessons
    }))

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: { studentId: user.id }
    })

    // Simple achievements based on actual data
    const achievements = [
      {
        title: 'First Steps',
        icon: 'Zap',
        unlocked: totalCourses > 0,
        date: totalCourses > 0 ? enrollments[0].enrolledAt.toISOString() : null
      },
      {
        title: 'Dedicated Learner',
        icon: 'Fire',
        unlocked: currentStreak >= 3,
        date: currentStreak >= 3 ? new Date().toISOString() : null
      },
      {
        title: 'Course Master',
        icon: 'Trophy',
        unlocked: certificates.length > 0,
        date: certificates.length > 0 ? certificates[0].issuedAt.toISOString() : null
      },
      {
        title: 'High Achiever',
        icon: 'Award',
        unlocked: avgProgress >= 75,
        date: avgProgress >= 75 ? new Date().toISOString() : null
      }
    ]

    return NextResponse.json({
      overallProgress: avgProgress,
      weeklyGoal: 80, // Can be made dynamic later
      currentStreak,
      courseProgress,
      weeklyActivity,
      achievements
    })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}
