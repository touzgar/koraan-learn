'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Award,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalCourses: number
    totalEnrollments: number
    activeEnrollments: number
    completedEnrollments: number
    cancelledEnrollments: number
    totalRevenue: number
    completionRate: string
    avgRevenuePerEnrollment: string
  }
  growth: {
    usersLast7Days: number
    usersLast30Days: number
    enrollmentsLast7Days: number
    enrollmentsLast30Days: number
  }
  distribution: {
    usersByRole: Array<{ role: string; _count: number }>
    coursesByStatus: Array<{ status: string; _count: number }>
    coursesByCategory: Array<{ categoryId: string | null; _count: number }>
  }
  trends: {
    enrollmentsByMonth: Array<{ month: string; count: number }>
    userGrowthByMonth: Array<{ month: string; count: number }>
  }
  topCourses: Array<{
    id: string
    title: string
    _count: { enrollments: number }
    instructor: { firstName: string | null; lastName: string | null }
  }>
  recentEnrollments: Array<{
    id: string
    enrolledAt: Date
    student: { firstName: string | null; lastName: string | null; email: string }
    course: { title: string }
  }>
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const stats = [
    {
      title: 'Total Users',
      value: data.overview.totalUsers,
      change: `+${data.growth.usersLast30Days}`,
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Courses',
      value: data.overview.totalCourses,
      change: 'Active',
      trend: 'up' as const,
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Total Enrollments',
      value: data.overview.totalEnrollments,
      change: `+${data.growth.enrollmentsLast30Days}`,
      trend: 'up' as const,
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Revenue',
      value: `${data.overview.totalRevenue.toFixed(0)}€`,
      change: `${data.overview.avgRevenuePerEnrollment}€ avg`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Completion Rate',
      value: `${data.overview.completionRate}%`,
      change: `${data.overview.completedEnrollments} completed`,
      trend: 'up' as const,
      icon: Award,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Active Enrollments',
      value: data.overview.activeEnrollments,
      change: `${((data.overview.activeEnrollments / data.overview.totalEnrollments) * 100).toFixed(1)}%`,
      trend: 'up' as const,
      icon: Activity,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
  ]

  // Calculate max values for chart scaling
  const maxEnrollments = Math.max(...data.trends.enrollmentsByMonth.map(d => d.count), 1)
  const maxUsers = Math.max(...data.trends.userGrowthByMonth.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Comprehensive platform performance metrics</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-lg border border-emerald-100">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                timeRange === range
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', stat.bgColor)}>
                <stat.icon className={cn('w-7 h-7', stat.textColor)} />
              </div>
              <div className={cn(
                'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
                stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              )}>
                {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Enrollment Trends</h2>
              <p className="text-xs text-gray-600">Last 6 months</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.trends.enrollmentsByMonth.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.month}</span>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxEnrollments) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">User Growth</h2>
              <p className="text-xs text-gray-600">New users per month</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.trends.userGrowthByMonth.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.month}</span>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxUsers) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by Role */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Users by Role</h2>
              <p className="text-xs text-gray-600">Distribution</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.distribution.usersByRole.map((item) => {
              const colors = {
                ADMIN: { bg: 'bg-purple-100', bar: 'from-purple-500 to-purple-600', text: 'text-purple-700' },
                INSTRUCTOR: { bg: 'bg-blue-100', bar: 'from-blue-500 to-blue-600', text: 'text-blue-700' },
                STUDENT: { bg: 'bg-emerald-100', bar: 'from-emerald-500 to-emerald-600', text: 'text-emerald-700' },
              }[item.role] || { bg: 'bg-gray-100', bar: 'from-gray-500 to-gray-600', text: 'text-gray-700' }

              const percentage = ((item._count / data.overview.totalUsers) * 100).toFixed(1)

              return (
                <div key={item.role} className={cn('rounded-xl p-4', colors.bg)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-sm font-bold', colors.text)}>{item.role}</span>
                    <span className={cn('text-lg font-bold', colors.text)}>{item._count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/50 rounded-full h-2">
                      <div
                        className={cn('h-2 rounded-full bg-gradient-to-r', colors.bar)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={cn('text-xs font-semibold', colors.text)}>{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Courses by Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Course Status</h2>
              <p className="text-xs text-gray-600">Distribution</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.distribution.coursesByStatus.map((item) => {
              const colors = {
                DRAFT: { bg: 'bg-yellow-100', bar: 'from-yellow-500 to-yellow-600', text: 'text-yellow-700' },
                PUBLISHED: { bg: 'bg-green-100', bar: 'from-green-500 to-green-600', text: 'text-green-700' },
                ARCHIVED: { bg: 'bg-gray-100', bar: 'from-gray-500 to-gray-600', text: 'text-gray-700' },
              }[item.status] || { bg: 'bg-gray-100', bar: 'from-gray-500 to-gray-600', text: 'text-gray-700' }

              const percentage = ((item._count / data.overview.totalCourses) * 100).toFixed(1)

              return (
                <div key={item.status} className={cn('rounded-xl p-4', colors.bg)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-sm font-bold', colors.text)}>{item.status}</span>
                    <span className={cn('text-lg font-bold', colors.text)}>{item._count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/50 rounded-full h-2">
                      <div
                        className={cn('h-2 rounded-full bg-gradient-to-r', colors.bar)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={cn('text-xs font-semibold', colors.text)}>{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Enrollment Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Enrollment Status</h2>
              <p className="text-xs text-gray-600">Distribution</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { status: 'ACTIVE', count: data.overview.activeEnrollments, bg: 'bg-emerald-100', bar: 'from-emerald-500 to-emerald-600', text: 'text-emerald-700' },
              { status: 'COMPLETED', count: data.overview.completedEnrollments, bg: 'bg-blue-100', bar: 'from-blue-500 to-blue-600', text: 'text-blue-700' },
              { status: 'CANCELLED', count: data.overview.cancelledEnrollments, bg: 'bg-red-100', bar: 'from-red-500 to-red-600', text: 'text-red-700' },
            ].map((item) => {
              const percentage = ((item.count / data.overview.totalEnrollments) * 100).toFixed(1)

              return (
                <div key={item.status} className={cn('rounded-xl p-4', item.bg)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-sm font-bold', item.text)}>{item.status}</span>
                    <span className={cn('text-lg font-bold', item.text)}>{item.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/50 rounded-full h-2">
                      <div
                        className={cn('h-2 rounded-full bg-gradient-to-r', item.bar)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={cn('text-xs font-semibold', item.text)}>{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Courses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Top Performing Courses</h2>
              <p className="text-xs text-gray-600">By enrollment count</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.topCourses.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-600">
                    by {course.instructor.firstName || 'Unknown'} {course.instructor.lastName || ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">{course._count.enrollments}</p>
                  <p className="text-xs text-gray-600">enrollments</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Enrollments</h2>
              <p className="text-xs text-gray-600">Latest activity</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.recentEnrollments.slice(0, 5).map((enrollment) => (
              <div key={enrollment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(enrollment.student.firstName?.[0] || 'U')}{(enrollment.student.lastName?.[0] || '')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {enrollment.student.firstName || 'Unknown'} {enrollment.student.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{enrollment.course.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(enrollment.enrolledAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
