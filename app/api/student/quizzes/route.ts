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

    // Get all courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      select: { courseId: true }
    })

    const enrolledCourseIds = enrollments.map(e => e.courseId)

    // Get all quizzes from enrolled courses
    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId: { in: enrolledCourseIds }
      },
      include: {
        course: {
          select: {
            title: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            questions: true
          }
        },
        quizAttempts: {
          where: {
            studentId: user.id
          },
          orderBy: {
            attemptedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const quizzesData = quizzes.map(quiz => {
      const lastAttempt = quiz.quizAttempts[0]
      const hasAttempted = !!lastAttempt
      const isPassed = lastAttempt?.isPassed || false
      const score = lastAttempt?.score || null
      const attempts = quiz.quizAttempts.length

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        course: quiz.course.title,
        courseId: quiz.courseId,
        category: quiz.course.category?.name || 'General',
        questions: quiz._count.questions,
        passingScore: quiz.passingScore,
        duration: Math.ceil(quiz._count.questions * 2), // Estimate 2 min per question
        status: !hasAttempted ? 'available' : isPassed ? 'completed' : 'failed',
        score,
        attempts,
        passed: isPassed,
        completedDate: lastAttempt?.attemptedAt.toISOString() || null
      }
    })

    return NextResponse.json({ quizzes: quizzesData })
  } catch (error) {
    console.error('Quizzes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}
