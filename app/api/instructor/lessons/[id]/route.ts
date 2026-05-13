import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single lesson
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lesson = await prisma.lesson.findFirst({
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
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

// PATCH update lesson
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

    // Check if lesson belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id,
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      lesson: updatedLesson,
      message: 'Lesson updated successfully',
    })
  } catch (error) {
    console.error('Update lesson error:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    )
  }
}

// DELETE lesson
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if lesson belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id,
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Lesson deleted successfully',
    })
  } catch (error) {
    console.error('Delete lesson error:', error)
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    )
  }
}
