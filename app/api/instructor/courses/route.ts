import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all courses for instructor
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        category: true,
        enrollments: true,
        lessons: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.imageUrl,
        students: course.enrollments.length,
        lessons: course.lessons.length,
        duration: `${course.lessons.length * 30} min`, // Estimate
        rating: 0, // TODO: Implement ratings
        reviews: 0,
        status: course.status,
        price: course.price,
        category: course.category?.name,
      })),
    })
  } catch (error) {
    console.error('Courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST create new course
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, categoryId, status } = body

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        categoryId: categoryId || null,
        status: status || 'DRAFT',
        isPublished: status === 'PUBLISHED',
        instructorId: user.id,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      course,
      message: 'Course created successfully',
    })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
