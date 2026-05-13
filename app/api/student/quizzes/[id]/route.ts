import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
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
        questions: {
          orderBy: {
            position: 'asc'
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
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check if student is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: quiz.courseId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    const lastAttempt = quiz.quizAttempts[0]

    const quizData = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      course: quiz.course.title,
      courseId: quiz.courseId,
      passingScore: quiz.passingScore,
      duration: Math.ceil(quiz.questions.length * 2), // 2 min per question
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer, // Will be removed before sending to client
        explanation: q.explanation,
        position: q.position
      })),
      attempts: quiz.quizAttempts.length,
      lastScore: lastAttempt?.score || null,
      lastPassed: lastAttempt?.isPassed || null
    }

    // Remove correct answers from questions (don't send to client)
    quizData.questions = quizData.questions.map(q => {
      const { correctAnswer, ...questionWithoutAnswer } = q
      return questionWithoutAnswer as any
    })

    return NextResponse.json({ quiz: quizData })
  } catch (error) {
    console.error('Quiz detail error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}
