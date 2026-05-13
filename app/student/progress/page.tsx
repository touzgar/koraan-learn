'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  Trophy,
  Flame,
  BookOpen,
  BarChart,
  Loader2,
  Star
} from 'lucide-react'

interface ProgressData {
  overallProgress: number
  weeklyGoal: number
  currentStreak: number
  courseProgress: Array<{
    course: string
    progress: number
    lessons: number
    total: number
  }>
  weeklyActivity: Array<{
    day: string
    hours: number
  }>
  achievements: Array<{
    title: string
    icon: string
    unlocked: boolean
    date: string | null
  }>
}

export default function StudentProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/student/progress')
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Zap, Trophy, Flame, Award }
    return icons[iconName] || Award
  }

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
        <p className="text-gray-600">Failed to load progress data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Star className="w-10 h-10" />
          My Progress
        </h1>
        <p className="text-emerald-100 text-lg">Track your learning journey</p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl hover:scale-105 transition-all">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <p className="text-5xl font-bold mb-2">{data.overallProgress}%</p>
            <p className="text-emerald-100">Overall Progress</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl hover:scale-105 transition-all">
          <div className="text-center">
            <Flame className="w-12 h-12 mx-auto mb-4" />
            <p className="text-5xl font-bold mb-2">{data.currentStreak}</p>
            <p className="text-amber-100">Day Streak 🔥</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl hover:scale-105 transition-all">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <p className="text-5xl font-bold mb-2">{data.weeklyGoal}%</p>
            <p className="text-teal-100">Weekly Goal</p>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart className="w-7 h-7 text-emerald-600" />
          Weekly Activity
        </h2>
        <div className="flex items-end justify-between gap-4 h-48">
          {data.weeklyActivity.map((day) => {
            const maxHours = 5
            const heightPercent = (day.hours / maxHours) * 100
            
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl relative group cursor-pointer hover:from-emerald-600 hover:to-teal-500 transition-all"
                  style={{ height: `${heightPercent}%`, minHeight: day.hours > 0 ? '20px' : '0' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {day.hours}h
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{day.day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Course Progress */}
      {data.courseProgress.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-600" />
            Course Progress
          </h2>
          <div className="space-y-4">
            {data.courseProgress.map((course) => (
              <div
                key={course.course}
                className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{course.course}</h3>
                  <span className="text-3xl font-bold text-emerald-600">{course.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{course.lessons} / {course.total} lessons completed</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-600" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.achievements.map((achievement) => {
            const Icon = getIconComponent(achievement.icon)
            return (
              <div
                key={achievement.title}
                className={`p-6 rounded-2xl text-center transition-all hover:scale-105 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-lg'
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg'
                    : 'bg-gray-300'
                }`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                {achievement.unlocked && achievement.date && (
                  <p className="text-xs text-gray-600">
                    Unlocked {new Date(achievement.date).toLocaleDateString()}
                  </p>
                )}
                {!achievement.unlocked && (
                  <p className="text-xs text-gray-500">Locked</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
