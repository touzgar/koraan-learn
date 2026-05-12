'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  TrendingUp,
  Award,
  PlayCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Target,
  Clock
} from 'lucide-react'

interface DashboardData {
  stats: {
    totalCourses: number
    completedCourses: number
    certificates: number
    avgProgress: number
  }
  activeCourses: Array<{
    id: string
    title: string
    instructor: string
    progress: number
    thumbnail: string | null
    category: string
    totalLessons: number
  }>
  user: {
    firstName: string
    lastName: string
  }
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard')
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Simple Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {data.user.firstName}! 👋</h1>
            <p className="text-emerald-100 text-lg">Ready to continue learning?</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <p className="text-3xl font-bold">{data.stats.avgProgress}%</p>
              <p className="text-emerald-100 text-sm">Overall Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{data.stats.totalCourses}</p>
              <p className="text-sm text-gray-600">My Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{data.stats.avgProgress}%</p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{data.stats.certificates}</p>
              <p className="text-sm text-gray-600">Certificates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{data.stats.completedCourses}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {data.activeCourses.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              Continue Learning
            </h2>
            <Link href="/student/courses">
              <button className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.activeCourses.map((course) => (
              <Link key={course.id} href={`/student/courses/${course.id}`}>
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all group cursor-pointer">
                  {/* Simple Thumbnail */}
                  <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative">
                    <BookOpen className="w-16 h-16 text-emerald-600/30" />
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                        {course.progress}%
                      </div>
                    </div>
                  </div>

                  {/* Simple Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

                    {/* Simple Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Simple Button */}
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold">
                      <PlayCircle className="w-5 h-5" />
                      Continue
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <BookOpen className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Courses</h3>
          <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
          <Link href="/student/courses">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold">
              Browse Courses
            </button>
          </Link>
        </div>
      )}

      {/* Simple Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/student/courses">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-10 h-10 text-emerald-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">My Courses</h3>
            <p className="text-sm text-gray-600">View all your courses</p>
          </div>
        </Link>

        <Link href="/student/progress">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl hover:border-teal-300 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-teal-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">My Progress</h3>
            <p className="text-sm text-gray-600">Track your learning</p>
          </div>
        </Link>

        <Link href="/student/certificates">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-10 h-10 text-amber-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Certificates</h3>
            <p className="text-sm text-gray-600">View achievements</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
