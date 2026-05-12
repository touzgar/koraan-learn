import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get enrollment with course details
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: params.id
        }
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            category: {
              select: {
                name: true
              }
            },
            lessons: {
              orderBy: {
                position: 'asc'
              }
            }
          }
        },
        lessonProgress: {
          select: {
            lessonId: true,
            isCompleted: true
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Course not found or not enrolled' }, { status: 404 })
    }

    const course = enrollment.course
    const completedLessonIds = new Set(
      enrollment.lessonProgress.filter(lp => lp.isCompleted).map(lp => lp.lessonId)
    )

    // Determine which lessons are locked (lessons after the first incomplete one)
    let foundIncomplete = false
    const lessons = course.lessons.map((lesson, index) => {
      const isCompleted = completedLessonIds.has(lesson.id)
      
      // If this lesson is not completed and we haven't found an incomplete lesson yet
      if (!isCompleted && !foundIncomplete) {
        foundIncomplete = true
      }
      
      // Lock lessons after the first incomplete one (unless they're free)
      const isLocked = foundIncomplete && !isCompleted && !lesson.isFree && index > 0

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        position: lesson.position,
        isCompleted,
        isLocked,
        videoUrl: lesson.videoUrl,
        pdfUrl: lesson.pdfUrl,
        isFree: lesson.isFree
      }
    })

    // Calculate estimated time (sum of all lesson durations)
    const estimatedTime = Math.round(
      course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) / 60
    )

    const courseDetail = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
      category: course.category?.name || 'General',
      imageUrl: course.imageUrl,
      progress: enrollment.progress,
      totalLessons: course.lessons.length,
      completedLessons: completedLessonIds.size,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      status: enrollment.progress === 100 ? 'completed' : 'in-progress',
      lessons,
      estimatedTime
    }

    return NextResponse.json({ course: courseDetail })
  } catch (error) {
    console.error('Course detail error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course details' },
      { status: 500 }
    )
  }
}
