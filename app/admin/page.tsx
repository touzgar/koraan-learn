import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import StatsCards from '@/components/admin/StatsCards'
import RecentUsers from '@/components/admin/RecentUsers'
import RecentCourses from '@/components/admin/RecentCourses'
import UserRoleChart from '@/components/admin/UserRoleChart'
import CourseStatusChart from '@/components/admin/CourseStatusChart'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  try {
    const user = await getCurrentUser()

    // Calculate date ranges for trend comparison
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Fetch current and previous period statistics
    const [
      totalUsers,
      previousUsers,
      totalCourses,
      previousCourses,
      totalEnrollments,
      previousEnrollments,
      activeEnrollments,
      previousActiveEnrollments,
      recentUsers,
      recentCourses,
      usersByRole,
      coursesByStatus,
      pendingValidationCount,
    ] = await Promise.all([
      // Current period (last 30 days)
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      // Previous period (30-60 days ago)
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo 
          } 
        } 
      }),
      prisma.course.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.course.count({ 
        where: { 
          createdAt: { 
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo 
          } 
        } 
      }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: thirtyDaysAgo } } }),
      prisma.enrollment.count({ 
        where: { 
          enrolledAt: { 
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo 
          } 
        } 
      }),
      prisma.enrollment.count({ 
        where: { 
          status: 'ACTIVE',
          enrolledAt: { gte: thirtyDaysAgo }
        } 
      }),
      prisma.enrollment.count({ 
        where: { 
          status: 'ACTIVE',
          enrolledAt: { 
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo 
          }
        } 
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          imageUrl: true,
          createdAt: true,
          isActive: true,
        },
      }),
      prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.course.groupBy({
        by: ['status'],
        _count: true,
      }),
      // Count courses pending validation (DRAFT status)
      prisma.course.count({ where: { status: 'DRAFT' } }),
    ])

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%'
      const change = ((current - previous) / previous) * 100
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
    }

    const calculateTrend = (current: number, previous: number): 'up' | 'down' => {
      return current >= previous ? 'up' : 'down'
    }

    // Calculate total revenue from active enrollments
    const totalRevenue = await prisma.enrollment.findMany({
      where: { status: 'ACTIVE' },
      include: {
        course: {
          select: { price: true }
        }
      }
    }).then(enrollments => 
      enrollments.reduce((sum, e) => sum + e.course.price, 0)
    )

    const previousRevenue = await prisma.enrollment.findMany({
      where: { 
        status: 'ACTIVE',
        enrolledAt: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        }
      },
      include: {
        course: {
          select: { price: true }
        }
      }
    }).then(enrollments => 
      enrollments.reduce((sum, e) => sum + e.course.price, 0)
    )

    const stats = [
      {
        title: 'Total Utilisateurs',
        value: await prisma.user.count(),
        change: calculateChange(totalUsers, previousUsers),
        trend: calculateTrend(totalUsers, previousUsers),
        icon: 'users',
      },
      {
        title: 'Total Cours',
        value: await prisma.course.count(),
        change: calculateChange(totalCourses, previousCourses),
        trend: calculateTrend(totalCourses, previousCourses),
        icon: 'courses',
      },
      {
        title: 'Inscriptions',
        value: await prisma.enrollment.count(),
        change: calculateChange(totalEnrollments, previousEnrollments),
        trend: calculateTrend(totalEnrollments, previousEnrollments),
        icon: 'enrollments',
      },
      {
        title: 'Revenus',
        value: `${totalRevenue.toFixed(0)}€`,
        change: calculateChange(totalRevenue, previousRevenue),
        trend: calculateTrend(totalRevenue, previousRevenue),
        icon: 'revenue',
      },
    ]

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl shadow-emerald-600/20">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {user?.firstName} ! 👋
          </h1>
          <p className="text-emerald-100">
            Voici un aperçu de votre plateforme e-learning
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserRoleChart data={usersByRole} />
          <CourseStatusChart data={coursesByStatus} />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentUsers users={recentUsers} />
          <RecentCourses courses={recentCourses} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Database connection error:', error)
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the database. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }
}

// Helper function for the pending validation count
async function getPendingValidationCount() {
  return await prisma.course.count({ where: { status: 'DRAFT' } })
}
