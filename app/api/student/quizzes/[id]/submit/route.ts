import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { answers } = await request.json()

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
    }

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check enrollment
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

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = quiz.questions.length

    if (totalQuestions === 0) {
      return NextResponse.json({ error: 'Quiz has no questions' }, { status: 400 })
    }

    quiz.questions.forEach((question, index) => {
      const studentAnswer = answers[index]
      if (studentAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const isPassed = score >= quiz.passingScore

    // Save quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        studentId: user.id,
        quizId: quiz.id,
        score,
        isPassed,
        answers: answers
      }
    })

    return NextResponse.json({
      success: true,
      attemptId: quizAttempt.id,
      score,
      isPassed,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      totalQuestions,
      passingScore: quiz.passingScore
    })
  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}
