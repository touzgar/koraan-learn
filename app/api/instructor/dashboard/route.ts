import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get instructor's courses count
    const coursesCount = await prisma.course.count({
      where: { instructorId: user.id },
    })

    // Get total students enrolled in instructor's courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    })
    const enrollmentsCount = enrollments.length

    // Get certificates issued for instructor's courses
    const certificates = await prisma.certificate.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    })
    const certificatesCount = certificates.length

    // Get recent courses
    const recentCourses = await prisma.course.findMany({
      where: { instructorId: user.id },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        enrollments: true,
      },
    })

    // Get recent students activity
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      take: 4,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    })

    // Calculate revenue
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        enrollments: true,
      },
    })

    const totalRevenue = courses.reduce((sum, course) => {
      return sum + (course.price * course.enrollments.length)
    }, 0)

    // Get unique students count
    const uniqueStudents = new Set(enrollments.map(e => e.studentId)).size

    // Calculate average course rating
    const reviews = await prisma.review.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    })

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'

    return NextResponse.json({
      stats: {
        totalCourses: coursesCount,
        totalStudents: uniqueStudents,
        courseViews: 0,
        certificatesIssued: certificatesCount,
        totalRevenue: totalRevenue.toFixed(2),
        avgRating: parseFloat(avgRating),
      },
      recentCourses: recentCourses.map((course) => ({
        id: course.id,
        title: course.title,
        students: course.enrollments.length,
        rating: 0,
        status: course.status,
      })),
      recentStudents: recentEnrollments.map((enrollment) => ({
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        course: enrollment.course.title,
        progress: enrollment.progress,
      })),
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
