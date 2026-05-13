'use client'

import { motion } from 'framer-motion'
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Target,
  Star,
  PlayCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  Zap,
  Trophy,
  Flame,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function StudentDashboard() {
  const [userName, setUserName] = useState('Student')

  useEffect(() => {
    // Fetch user data
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
  // Mock data
  const stats = [
    {
      label: 'Enrolled Courses',
      value: '12',
      icon: BookOpen,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      change: '+2 this month'
    },
    {
      label: 'Overall Progress',
      value: '85%',
      icon: TrendingUp,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      change: '+12% this week'
    },
    {
      label: 'Certificates Earned',
      value: '8',
      icon: Award,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50',
      change: '3 pending'
    },
    {
      label: 'Learning Hours',
      value: '124h',
      icon: Clock,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '18h this week'
    }
  ]

  const activeCourses = [
    {
      id: 1,
      title: 'Advanced React & Next.js',
      instructor: 'Sarah Johnson',
      progress: 75,
      thumbnail: null,
      nextLesson: 'State Management with Redux',
      dueDate: '2 days left',
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'UI/UX Design Masterclass',
      instructor: 'Mike Chen',
      progress: 45,
      thumbnail: null,
      nextLesson: 'Prototyping in Figma',
      dueDate: '5 days left',
      category: 'Design'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      instructor: 'Dr. Emily Brown',
      progress: 90,
      thumbnail: null,
      nextLesson: 'Final Project',
      dueDate: '1 day left',
      category: 'Data Science'
    }
  ]

  const upcomingLessons = [
    { id: 1, title: 'State Management with Redux', course: 'Advanced React', time: 'Today, 2:00 PM', duration: '45 min' },
    { id: 2, title: 'Prototyping in Figma', course: 'UI/UX Design', time: 'Tomorrow, 10:00 AM', duration: '60 min' },
    { id: 3, title: 'Machine Learning Basics', course: 'Python for Data Science', time: 'Tomorrow, 3:00 PM', duration: '90 min' }
  ]

  const achievements = [
    { id: 1, title: 'Fast Learner', description: 'Complete 5 courses in a month', icon: Zap, unlocked: true },
    { id: 2, title: 'Perfect Score', description: 'Get 100% on 3 quizzes', icon: Trophy, unlocked: true },
    { id: 3, title: 'Streak Master', description: '7 days learning streak', icon: Flame, unlocked: false },
    { id: 4, title: 'Course Completer', description: 'Finish 10 courses', icon: Target, unlocked: false }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
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
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            <Link href="/student/courses">
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {activeCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {course.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2">{course.title}</h3>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{course.progress}%</p>
                        <p className="text-xs text-gray-500">Complete</p>
                      </div>
                    </div>

                    <div className="mt-4 mb-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-semibold">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PlayCircle className="w-4 h-4" />
                        <span>Next: {course.nextLesson}</span>
                      </div>
                      <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                        {course.dueDate}
                      </span>
                    </div>

                    <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg">
                      <PlayCircle className="w-5 h-5" />
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Lessons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Upcoming Lessons</h3>
            </div>
            <div className="space-y-3">
              {upcomingLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all"
                >
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{lesson.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{lesson.course}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-600 font-medium">{lesson.time}</span>
                    <span className="text-gray-500">{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/student/calendar">
              <button className="mt-4 w-full py-2 text-purple-600 hover:text-purple-700 font-semibold text-sm">
                View Full Calendar →
              </button>
            </Link>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
            </div>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-xl border transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : 'bg-gray-300'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <Link href="/student/progress">
              <button className="mt-4 w-full py-2 text-yellow-600 hover:text-yellow-700 font-semibold text-sm">
                View All Achievements →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
