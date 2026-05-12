import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all instructor's courses with enrollments
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        reviews: true,
      },
    })

    // Get all enrollments for this instructor
    const allEnrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    // Get unique students count
    const uniqueStudentIds = new Set(allEnrollments.map((e) => e.studentId))
    const totalStudents = uniqueStudentIds.size

    // Calculate total enrollments
    const totalEnrollments = allEnrollments.length

    // Get certificates count
    const totalCertificates = await prisma.certificate.count({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    })

    // Calculate revenue
    const revenue = allEnrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course.price || 0)
    }, 0)

    // Calculate average completion rate
    const avgCompletionRate =
      allEnrollments.length > 0
        ? Math.round(allEnrollments.reduce((sum, e) => sum + e.progress, 0) / allEnrollments.length)
        : 0

    // Top performing courses
    const coursesWithStats = courses.map((course) => {
      const courseEnrollments = allEnrollments.filter((e) => e.courseId === course.id)
      
      const avgRating =
        course.reviews.length > 0
          ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
          : 0

      const completionRate =
        courseEnrollments.length > 0
          ? Math.round(
              courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length
            )
          : 0

      return {
        name: course.title,
        students: courseEnrollments.length,
        revenue: course.price * courseEnrollments.length,
        rating: avgRating,
        completionRate,
      }
    })

    const topCourses = coursesWithStats
      .sort((a, b) => b.students - a.students)
      .slice(0, 5)

    // Generate monthly data (last 12 months)
    const monthlyEnrollments = new Array(12).fill(0)
    const monthlyRevenue = new Array(12).fill(0)

    allEnrollments.forEach((enrollment) => {
      const month = new Date(enrollment.enrolledAt).getMonth()
      monthlyEnrollments[month]++
      monthlyRevenue[month] += enrollment.course.price || 0
    })

    // Recent activity
    const recentActivity = allEnrollments.slice(0, 10).map((enrollment) => {
      const studentName = `${enrollment.student.firstName || ''} ${enrollment.student.lastName || ''}`.trim() || 'Unknown Student'

      return {
        type: 'enrollment',
        message: `${studentName} enrolled in ${enrollment.course.title}`,
        time: getRelativeTime(enrollment.enrolledAt),
      }
    })

    // Add certificate activities
    const recentCertificates = await prisma.certificate.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      take: 5,
      orderBy: { issuedAt: 'desc' },
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

    recentCertificates.forEach((cert) => {
      const studentName = `${cert.student.firstName || ''} ${cert.student.lastName || ''}`.trim() || 'Unknown Student'
      recentActivity.push({
        type: 'certificate',
        message: `${studentName} earned a certificate for ${cert.course.title}`,
        time: getRelativeTime(cert.issuedAt),
      })
    })

    // Sort and limit recent activity
    const sortedActivity = recentActivity
      .sort((a, b) => {
        // Sort by time (most recent first)
        return 0 // Already sorted by query
      })
      .slice(0, 10)

    console.log('Analytics Debug:', {
      totalStudents,
      totalEnrollments,
      coursesCount: courses.length,
      uniqueStudentIds: Array.from(uniqueStudentIds),
    })

    return NextResponse.json({
      stats: {
        totalStudents,
        totalEnrollments,
        revenue: revenue.toFixed(2),
        certificates: totalCertificates,
        avgCompletionRate,
        totalCourses: courses.length,
      },
      topCourses,
      recentActivity: sortedActivity,
      monthlyData: {
        enrollments: monthlyEnrollments,
        revenue: monthlyRevenue,
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}
