import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, isPublished } = await request.json()

    // Check if course belongs to instructor
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        instructorId: user.id,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update course status
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        status: status || course.status,
        isPublished: isPublished !== undefined ? isPublished : course.isPublished,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      message: `Course ${status === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`,
    })
  } catch (error) {
    console.error('Update course status error:', error)
    return NextResponse.json(
      { error: 'Failed to update course status' },
      { status: 500 }
    )
  }
}
