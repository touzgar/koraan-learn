import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isPublished } = await request.json()

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

    // Update lesson publish status
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        isPublished,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      lesson: updatedLesson,
      message: `Lesson ${isPublished ? 'published' : 'unpublished'} successfully`,
    })
  } catch (error) {
    console.error('Update lesson publish status error:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson status' },
      { status: 500 }
    )
  }
}
