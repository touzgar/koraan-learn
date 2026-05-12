'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Star,
  Clock,
  Loader2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Calendar,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    totalCourses: number
    totalStudents: number
    courseViews: number
    certificatesIssued: number
    totalRevenue: string
    avgRating: number
  }
  recentCourses: Array<{
    id: string
    title: string
    students: number
    rating: number
    status: string
  }>
  recentStudents: Array<{
    name: string
    course: string
    progress: number
  }>
}

export default function InstructorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/instructor/dashboard')
      if (res.ok) {
        const dashboardData = await res.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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

  const mainStats = [
    {
      icon: BookOpen,
      label: 'Total Courses',
      value: data?.stats.totalCourses || 0,
      change: '+12%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: data?.stats.totalStudents || 0,
      change: '+23%',
      trend: 'up',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${data?.stats.totalRevenue || '0.00'}`,
      change: '+18%',
      trend: 'up',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      icon: Award,
      label: 'Certificates',
      value: data?.stats.certificatesIssued || 0,
      change: '+8%',
      trend: 'up',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ]

  const secondaryStats = [
    {
      icon: Star,
      label: 'Avg. Rating',
      value: data?.stats.avgRating.toFixed(1) || '0.0',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Eye,
      label: 'Course Views',
      value: data?.stats.courseViews || 0,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section with Time-based Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{greeting}, Instructor! 👋</h1>
              <p className="text-emerald-100 text-lg">
                Here's your teaching performance overview
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Courses & Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
            </div>
            <Link
              href="/instructor/courses"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 group"
            >
              View All
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentCourses && data.recentCourses.length > 0 ? (
              data.recentCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-emerald-50 hover:to-emerald-50/50 transition-all cursor-pointer border border-gray-100 hover:border-emerald-200 group"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} students
                      </span>
                      {course.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {course.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {course.status}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-300" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">No courses yet</p>
                <p className="text-sm">Create your first course to get started!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Student Activity</h2>
            </div>
            <Link
              href="/instructor/students"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 group"
            >
              View All
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentStudents && data.recentStudents.length > 0 ? (
              data.recentStudents.map((student, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-emerald-50 hover:to-emerald-50/50 transition-all border border-gray-100 hover:border-emerald-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-xs text-gray-500">{student.course}</p>
                      </div>
                    </div>
                    <span className="text-sm text-emerald-600 font-bold">
                      {student.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-300" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">No student activity</p>
                <p className="text-sm">Students will appear here when they enroll</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/instructor/courses"
            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-semibold">New Course</span>
          </Link>
          <Link
            href="/instructor/lessons"
            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-semibold">Add Lesson</span>
          </Link>
          <Link
            href="/instructor/certificates"
            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-semibold">Certificates</span>
          </Link>
          <Link
            href="/instructor/analytics"
            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-semibold">Analytics</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

