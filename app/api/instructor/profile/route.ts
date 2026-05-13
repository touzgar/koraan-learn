import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET instructor profile
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get instructor's courses
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        enrollments: true,
        reviews: true,
      },
    })

    // Get certificates issued for instructor's courses
    const certificates = await prisma.certificate.count({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    })

    // Calculate stats
    const totalCourses = courses.length
    const publishedCourses = courses.filter((c) => c.isPublished).length

    // Get unique students
    const uniqueStudents = new Set(
      courses.flatMap((c) => c.enrollments.map((e) => e.studentId))
    )
    const totalStudents = uniqueStudents.size

    // Calculate total revenue (sum of course prices * enrollments)
    const totalRevenue = courses.reduce((sum, course) => {
      return sum + course.price * course.enrollments.length
    }, 0)

    // Calculate average rating
    const allReviews = courses.flatMap((c) => c.reviews)
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0

    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      isActive: user.isActive,
      stats: {
        totalCourses,
        publishedCourses,
        totalStudents,
        certificates,
        totalRevenue,
        averageRating,
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching instructor profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT update instructor profile
export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName } = body

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      },
    })

    // Get updated stats
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        enrollments: true,
        reviews: true,
      },
    })

    const certificates = await prisma.certificate.count({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    })

    const totalCourses = courses.length
    const publishedCourses = courses.filter((c) => c.isPublished).length

    const uniqueStudents = new Set(
      courses.flatMap((c) => c.enrollments.map((e) => e.studentId))
    )
    const totalStudents = uniqueStudents.size

    const totalRevenue = courses.reduce((sum, course) => {
      return sum + course.price * course.enrollments.length
    }, 0)

    const allReviews = courses.flatMap((c) => c.reviews)
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0

    const profile = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      imageUrl: updatedUser.imageUrl,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      stats: {
        totalCourses,
        publishedCourses,
        totalStudents,
        certificates,
        totalRevenue,
        averageRating,
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating instructor profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
