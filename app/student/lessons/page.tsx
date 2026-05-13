'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  PlayCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Download,
  FileText,
  Video,
  Lock,
  Loader2
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  course: {
    id: string
    title: string
    instructor: string
  }
  duration: number
  completed: boolean
  position: number
  videoUrl: string | null
  pdfUrl: string | null
  description: string | null
}

export default function StudentLessonsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCourse, setFilterCourse] = useState('all')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [courses, setCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/student/lessons')
        if (response.ok) {
          const data = await response.json()
          setLessons(data.lessons || [])
          const courseTitles = data.lessons.map((l: any) => l.course.title) as string[]
          setCourses(['all', ...Array.from(new Set(courseTitles))])
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLessons()
  }, [])

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = filterCourse === 'all' || lesson.course.title === filterCourse
    return matchesSearch && matchesCourse
  })

  const stats = {
    total: lessons.length,
    completed: lessons.filter(l => l.completed).length,
    inProgress: lessons.filter(l => !l.completed).length,
    totalDuration: lessons.reduce((sum, l) => sum + l.duration, 0)
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          My Lessons
        </h1>
        <p className="text-gray-600 mt-1">Access all your course lessons in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-semibold mb-1">Total Lessons</p>
              <p className="text-3xl font-bold text-emerald-900">{stats.total}</p>
            </div>
            <PlayCircle className="w-12 h-12 text-emerald-600/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-semibold mb-1">In Progress</p>
              <p className="text-3xl font-bold text-amber-900">{stats.inProgress}</p>
            </div>
            <Clock className="w-12 h-12 text-amber-600/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-600 font-semibold mb-1">Total Duration</p>
              <p className="text-3xl font-bold text-teal-900">{Math.floor(stats.totalDuration / 60)}h</p>
            </div>
            <Video className="w-12 h-12 text-teal-600/30" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              {courses.map(course => (
                <option key={course} value={course}>
                  {course === 'all' ? 'All Courses' : course}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-6">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                lesson.completed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                {lesson.completed ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <PlayCircle className="w-8 h-8 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.course.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration} min</span>
                    </div>
                    {(lesson.videoUrl || lesson.pdfUrl) && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>Resources</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 flex items-center gap-3">
                  <Link href={`/student/lessons/${lesson.id}`}>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg">
                      <PlayCircle className="w-4 h-4" />
                      {lesson.completed ? 'Rewatch' : 'Start Lesson'}
                    </button>
                  </Link>
                  {(lesson.videoUrl || lesson.pdfUrl) && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                      <Download className="w-4 h-4" />
                      Resources
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <PlayCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
