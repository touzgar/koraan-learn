import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        questions: true,
        quizAttempts: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      quizzes: quizzes.map((quiz) => {
        const totalAttempts = quiz.quizAttempts.length
        const passedAttempts = quiz.quizAttempts.filter((a) => a.isPassed).length
        const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0

        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          course: quiz.course.title,
          courseId: quiz.courseId,
          questions: quiz.questions.length,
          attempts: totalAttempts,
          passRate,
          passingScore: quiz.passingScore,
        }
      }),
    })
  } catch (error) {
    console.error('Quizzes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, courseId, passingScore, questions } = body

    // Verify the course belongs to the instructor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
        passingScore: parseInt(passingScore),
        questions: {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
            position: index + 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    })

    return NextResponse.json({ quiz }, { status: 201 })
  } catch (error) {
    console.error('Create quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}
