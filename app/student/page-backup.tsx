'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  PlayCircle,
  Trophy,
  ArrowRight
} from 'lucide-react'

export default function StudentDashboard() {
  const [userName, setUserName] = useState('Student')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserName(data.user.firstName)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchUserData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Trophy className="w-16 h-16 text-yellow-300" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-sm text-blue-100">Current Streak</p>
              <p className="text-2xl font-bold">5 days 🔥</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-sm text-blue-100">Points Earned</p>
              <p className="text-2xl font-bold">2,450 ⭐</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +2 this month
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Enrolled Courses</h3>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12% this week
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Overall Progress</h3>
          <p className="text-3xl font-bold text-gray-900">85%</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              3 pending
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Certificates Earned</h3>
          <p className="text-3xl font-bold text-gray-900">8</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              18h this week
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Learning Hours</h3>
          <p className="text-3xl font-bold text-gray-900">124h</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/student/courses" className="block">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-12 h-12 text-blue-600" />
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Courses</h3>
            <p className="text-gray-600 text-sm">Continue your learning journey</p>
          </div>
        </Link>

        <Link href="/student/progress" className="block">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-12 h-12 text-green-600" />
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Progress</h3>
            <p className="text-gray-600 text-sm">Track your achievements</p>
          </div>
        </Link>

        <Link href="/student/certificates" className="block">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-12 h-12 text-yellow-600" />
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Certificates</h3>
            <p className="text-gray-600 text-sm">View your achievements</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
