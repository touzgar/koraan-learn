import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json({ quiz })
  } catch (error) {
    console.error('Get quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, courseId, passingScore, questions } = body

    // Verify the quiz belongs to the instructor
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id,
        },
      },
    })

    if (!existingQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // If courseId is being changed, verify the new course belongs to the instructor
    if (courseId && courseId !== existingQuiz.courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          instructorId: user.id,
        },
      })

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }
    }

    // Delete existing questions and create new ones
    await prisma.quizQuestion.deleteMany({
      where: { quizId: params.id },
    })

    // Update quiz with new questions
    const quiz = await prisma.quiz.update({
      where: { id: params.id },
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

    return NextResponse.json({ quiz })
  } catch (error) {
    console.error('Update quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the quiz belongs to the instructor
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id,
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Delete quiz (cascade will delete questions and attempts)
    await prisma.quiz.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    )
  }
}
