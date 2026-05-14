'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  BookOpen,
  PlayCircle,
  CheckCircle,
  Loader2,
  Plus,
  ArrowRight,
  Video,
  Award
} from 'lucide-react'

interface Course {
  id: string
  title: string
  instructor: string
  progress: number
  imageUrl: string | null
  category: string
  totalLessons: number
  completedLessons: number
  status: 'in-progress' | 'completed'
  enrolledAt: string
  price?: number
  description?: string
}

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled')
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [enrolledRes, availableRes] = await Promise.all([
          fetch('/api/student/courses'),
          fetch('/api/student/courses/available')
        ])

        if (enrolledRes.ok) {
          const data = await enrolledRes.json()
          setEnrolledCourses(data.courses || [])
        }

        if (availableRes.ok) {
          const data = await availableRes.json()
          setAvailableCourses(data.courses || [])
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const currentCourses = activeTab === 'enrolled' ? enrolledCourses : availableCourses

  const filteredCourses = currentCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">My Courses</h1>
        <p className="text-emerald-100 text-lg">
          {enrolledCourses.length} enrolled ÔÇó {availableCourses.length} available
        </p>
      </div>

      {/* Simple Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-emerald-100 flex gap-2">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'enrolled'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          My Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'available'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Explore ({availableCourses.length})
        </button>
      </div>

      {/* Simple Search */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Simple Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative">
                <BookOpen className="w-16 h-16 text-emerald-600/30" />
                <div className="absolute top-3 right-3">
                  {activeTab === 'enrolled' ? (
                    course.status === 'completed' ? (
                      <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Done
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                        {course.progress}%
                      </div>
                    )
                  ) : (
                    <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold">
                      ${course.price}
                    </div>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/95 rounded-full text-xs font-bold text-gray-900">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

                {activeTab === 'enrolled' ? (
                  <>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      </div>
                    </div>

                    {/* Button */}
                    <Link href={`/student/courses/${course.id}`}>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold">
                        {course.status === 'completed' ? (
                          <>
                            <Award className="w-5 h-5" />
                            View Certificate
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-5 h-5" />
                            Continue
                          </>
                        )}
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Description */}
                    {course.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Video className="w-4 h-4" />
                        <span>{course.totalLessons} lessons</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">
                        ${course.price}
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
                    >
                      <Plus className="w-5 h-5" />
                      Enroll Now
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <BookOpen className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activeTab === 'enrolled' ? 'No enrolled courses' : 'No courses available'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'enrolled' 
              ? 'Start learning by exploring available courses'
              : 'Check back later for new courses'}
          </p>
          {activeTab === 'enrolled' && availableCourses.length > 0 && (
            <button
              onClick={() => setActiveTab('available')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold inline-flex items-center gap-2"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
