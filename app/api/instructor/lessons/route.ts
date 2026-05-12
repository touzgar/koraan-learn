import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all lessons for instructor
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessons = await prisma.lesson.findMany({
      where: {
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
      orderBy: [{ position: 'asc' }],
    })

    return NextResponse.json({
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        course: lesson.course.title,
        courseId: lesson.course.id,
        type: lesson.videoUrl ? 'video' : 'document',
        duration: lesson.duration || 0,
        order: lesson.position,
        status: lesson.isFree ? 'Free' : 'Premium',
        isPublished: lesson.isPublished,
      })),
    })
  } catch (error) {
    console.error('Lessons error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

// POST create new lesson
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      courseId,
      videoUrl,
      pdfUrl,
      duration,
      position,
      isFree,
      isPublished,
    } = body

    // Verify course belongs to instructor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or unauthorized' },
        { status: 404 }
      )
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        courseId,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        duration: duration || null,
        position,
        isFree: isFree || false,
        isPublished: isPublished || false,
      },
    })

    return NextResponse.json({
      success: true,
      lesson,
      message: 'Lesson created successfully',
    })
  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}
