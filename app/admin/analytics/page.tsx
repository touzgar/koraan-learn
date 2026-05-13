import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AnalyticsClient from '@/components/admin/AnalyticsClient'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AnalyticsPage() {
  try {
    const user = await getCurrentUser()
    
    // Redirect if not authenticated or not admin
    if (!user) {
      redirect('/sign-in')
    }
    
    if (user.role !== 'ADMIN') {
      redirect('/dashboard')
    }
    
    // Date ranges for trend analysis
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch comprehensive analytics data
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      cancelledEnrollments,
      totalRevenue,
      usersLast7Days,
      usersLast30Days,
      enrollmentsLast7Days,
      enrollmentsLast30Days,
      usersByRole,
      coursesByStatus,
      coursesByCategory,
      topCourses,
      recentEnrollments,
      enrollmentsByMonth,
      userGrowthByMonth,
    ] = await Promise.all([
      // Basic counts
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
      prisma.enrollment.count({ where: { status: 'CANCELLED' } }),
      
      // Revenue calculation
      prisma.enrollment.findMany({
        where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
        include: { course: { select: { price: true } } }
      }).then(enrollments => enrollments.reduce((sum, e) => sum + e.course.price, 0)),
      
      // Growth metrics
      prisma.user.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.user.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: last7Days } } }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: last30Days } } }),
      
      // Distribution data
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.course.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.course.groupBy({
        by: ['categoryId'],
        _count: true,
      }),
      
      // Top performing courses
      prisma.course.findMany({
        take: 10,
        include: {
          _count: { select: { enrollments: true } },
          instructor: { select: { firstName: true, lastName: true } },
        },
        orderBy: { enrollments: { _count: 'desc' } }
      }),
      
      // Recent enrollments for activity feed
      prisma.enrollment.findMany({
        take: 10,
        orderBy: { enrolledAt: 'desc' },
        include: {
          student: { select: { firstName: true, lastName: true, email: true } },
          course: { select: { title: true } }
        }
      }),
      
      // Monthly enrollment trends (last 6 months)
      Promise.all(
        Array.from({ length: 6 }, (_, i) => {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
          return prisma.enrollment.count({
            where: {
              enrolledAt: {
                gte: monthStart,
                lte: monthEnd
              }
            }
          }).then(count => ({
            month: monthStart.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
            count
          }))
        })
      ).then(data => data.reverse()),
      
      // Monthly user growth (last 6 months)
      Promise.all(
        Array.from({ length: 6 }, (_, i) => {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
          return prisma.user.count({
            where: {
              createdAt: {
                gte: monthStart,
                lte: monthEnd
              }
            }
          }).then(count => ({
            month: monthStart.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
            count
          }))
        })
      ).then(data => data.reverse()),
    ])

    // Calculate completion rate
    const completionRate = totalEnrollments > 0 
      ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
      : '0'

    // Calculate average revenue per enrollment
    const avgRevenuePerEnrollment = totalEnrollments > 0
      ? (totalRevenue / totalEnrollments).toFixed(2)
      : '0'

    const analyticsData = {
      overview: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        cancelledEnrollments,
        totalRevenue,
        completionRate,
        avgRevenuePerEnrollment,
      },
      growth: {
        usersLast7Days,
        usersLast30Days,
        enrollmentsLast7Days,
        enrollmentsLast30Days,
      },
      distribution: {
        usersByRole,
        coursesByStatus,
        coursesByCategory,
      },
      trends: {
        enrollmentsByMonth,
        userGrowthByMonth,
      },
      topCourses,
      recentEnrollments,
    }

    return <AnalyticsClient data={analyticsData} />
  } catch (error) {
    console.error('Analytics page error:', error)
    
    // Fallback UI for errors
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to Load Analytics
          </h1>
          <p className="text-gray-600 mb-4">
            Unable to fetch analytics data. Please try again later.
          </p>
          <a 
            href="/admin" 
            className="text-blue-600 hover:underline"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }
}
