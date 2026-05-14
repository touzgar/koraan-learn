'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Award,
  Loader2,
  Star,
  Clock,
  Target,
  BarChart3,
} from 'lucide-react'

interface AnalyticsData {
  stats: {
    totalStudents: number
    totalEnrollments: number
    revenue: string
    certificates: number
    avgCompletionRate: number
    totalCourses: number
  }
  topCourses: Array<{
    name: string
    students: number
    revenue: number
    rating: number
    completionRate: number
  }>
  recentActivity: Array<{
    type: string
    message: string
    time: string
  }>
  monthlyData: {
    enrollments: number[]
    revenue: number[]
  }
}

export default function InstructorAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/instructor/analytics')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Students',
      value: data.stats.totalStudents.toString(),
      subValue: `${data.stats.totalEnrollments} enrollments`,
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-200',
      iconColor: 'text-blue-700',
      textColor: 'text-blue-900',
      subTextColor: 'text-blue-600',
    },
    {
      icon: BookOpen,
      label: 'Total Courses',
      value: data.stats.totalCourses.toString(),
      subValue: `${data.stats.avgCompletionRate}% avg completion`,
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-200',
      iconColor: 'text-purple-700',
      textColor: 'text-purple-900',
      subTextColor: 'text-purple-600',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${data.stats.revenue}`,
      subValue: 'All time earnings',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-200',
      iconColor: 'text-emerald-700',
      textColor: 'text-emerald-900',
      subTextColor: 'text-emerald-600',
    },
    {
      icon: Award,
      label: 'Certificates',
      value: data.stats.certificates.toString(),
      subValue: 'Issued to students',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-200',
      iconColor: 'text-orange-700',
      textColor: 'text-orange-900',
      subTextColor: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your performance and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedPeriod === 'week'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedPeriod === 'month'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedPeriod === 'year'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
              <h3 className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</h3>
              <p className={`text-sm font-semibold ${stat.subTextColor} mb-1`}>{stat.label}</p>
              <p className="text-xs text-gray-600">{stat.subValue}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Enrollment Trend</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyData.enrollments.map((value, index) => {
              const maxValue = Math.max(...data.monthlyData.enrollments, 1)
              const height = (value / maxValue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-600 cursor-pointer"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value} enrollments
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +15.3%
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyData.revenue.map((value, index) => {
              const maxValue = Math.max(...data.monthlyData.revenue, 1)
              const height = (value / maxValue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-lg transition-all hover:from-emerald-700 hover:to-emerald-600 cursor-pointer"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${value.toFixed(2)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Courses and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Courses</h2>
          {data.topCourses.length > 0 ? (
            <div className="space-y-4">
              {data.topCourses.map((course, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{course.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{course.students}</span>
                        </div>
                        {course.rating > 0 && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{course.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Target className="w-4 h-4" />
                          <span className="font-semibold">{course.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-emerald-600">${course.revenue.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No courses yet</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          {data.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'enrollment' ? 'bg-blue-100' :
                    activity.type === 'certificate' ? 'bg-orange-100' :
                    'bg-emerald-100'
                  }`}>
                    {activity.type === 'enrollment' ? (
                      <Users className="w-5 h-5 text-blue-600" />
                    ) : activity.type === 'certificate' ? (
                      <Award className="w-5 h-5 text-orange-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium line-clamp-2">{activity.message}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

