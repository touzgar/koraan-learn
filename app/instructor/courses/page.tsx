'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  Loader2,
  BookOpen,
  DollarSign,
  Star,
  MoreVertical,
  Copy,
  Archive,
  TrendingUp,
  Grid3x3,
  List,
  CheckCircle,
  XCircle,
  BarChart2,
  PlayCircle,
  Award,
  Target,
  Zap,
  Calendar,
  Share2,
  Download,
  Settings,
  Layers,
} from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  students: number
  lessons: number
  duration: string
  rating: number
  reviews: number
  status: string
  price: number
  category: string | null
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detailed'>('grid')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showQuickView, setShowQuickView] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
  }

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/instructor/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/instructor/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Remove course from state
        setCourses(courses.filter((c) => c.id !== courseId))
        setShowDeleteModal(false)
        setCourseToDelete(null)
        showToast('Course deleted successfully', 'success')
      } else {
        showToast('Failed to delete course', 'error')
      }
    } catch (error) {
      console.error('Failed to delete course:', error)
      showToast('Failed to delete course', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleStatus = async (courseId: string, currentStatus: string) => {
    setActionLoading(courseId)
    try {
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      const res = await fetch(`/api/instructor/courses/${courseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          isPublished: newStatus === 'PUBLISHED',
        }),
      })

      if (res.ok) {
        // Update course in state
        setCourses(
          courses.map((c) =>
            c.id === courseId ? { ...c, status: newStatus } : c
          )
        )
        showToast(
          `Course ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`,
          'success'
        )
      } else {
        showToast('Failed to update course status', 'error')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      showToast('Failed to update course status', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicateCourse = async (courseId: string) => {
    setActionLoading(courseId)
    try {
      // Get course details
      const res = await fetch(`/api/instructor/courses/${courseId}`)
      if (res.ok) {
        const { course } = await res.json()
        // TODO: Implement course duplication
        alert('Course duplication feature coming soon!')
      }
    } catch (error) {
      console.error('Failed to duplicate course:', error)
      alert('Failed to duplicate course')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || course.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const publishedCourses = courses.filter(c => c.status === 'PUBLISHED').length
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.students), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">Create and manage your courses</p>
          </div>
          <Link href="/instructor/courses/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </motion.button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-blue-900">{courses.length}</p>
                <p className="text-xs text-blue-600 mt-1">{publishedCourses} published</p>
              </div>
              <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-blue-700" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-semibold mb-1">Total Students</p>
                <p className="text-3xl font-bold text-emerald-900">{totalStudents}</p>
                <p className="text-xs text-emerald-600 mt-1">Across all courses</p>
              </div>
              <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-emerald-700" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-semibold mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-900">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-purple-600 mt-1">From enrollments</p>
              </div>
              <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-purple-700" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Detailed View"
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Display */}
      {filteredCourses.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden group-hover:h-52 transition-all duration-300">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-emerald-600/30" />
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedCourse(course)
                          setShowQuickView(true)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors text-sm font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        Quick View
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                        course.status === 'PUBLISHED'
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-gray-500/90 text-white'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-lg">
                      ${course.price.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-900">{course.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    {course.category && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {course.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex flex-col items-center gap-1 text-sm">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-bold text-gray-900">{course.students}</span>
                      <span className="text-xs text-gray-500">Students</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-sm">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-bold text-gray-900">{course.lessons}</span>
                      <span className="text-xs text-gray-500">Lessons</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-sm">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-bold text-gray-900">${(course.price * course.students).toFixed(0)}</span>
                      <span className="text-xs text-gray-500">Revenue</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/instructor/courses/${course.id}/edit`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-semibold">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(course.id, course.status)}
                      disabled={actionLoading === course.id}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                        course.status === 'PUBLISHED'
                          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {actionLoading === course.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : course.status === 'PUBLISHED' ? (
                        <Archive className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCourseToDelete(course.id)
                        setShowDeleteModal(true)
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : viewMode === 'detailed' ? (
          <div className="space-y-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Thumbnail & Quick Stats */}
                  <div className="lg:col-span-1 p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="relative h-48 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-xl overflow-hidden mb-4">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-emerald-600/30" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                            course.status === 'PUBLISHED'
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-gray-500/90 text-white'
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 text-center">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">{course.students}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">{course.lessons}</p>
                        <p className="text-xs text-gray-600">Lessons</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">{course.rating.toFixed(1)}</p>
                        <p className="text-xs text-gray-600">Rating</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">${course.price}</p>
                        <p className="text-xs text-gray-600">Price</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Course Details */}
                  <div className="lg:col-span-1 p-6">
                    <div className="mb-4">
                      {course.category && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {course.description || 'No description available'}
                    </p>

                    {/* Performance Metrics */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600">
                          {Math.floor(Math.random() * 30 + 60)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">Revenue</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600">
                          ${(course.price * course.students).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Reviews</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          {course.reviews} reviews
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Course Progress</span>
                        <span className="text-xs font-bold text-emerald-600">
                          {Math.floor(Math.random() * 40 + 60)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Analytics */}
                  <div className="lg:col-span-1 p-6 bg-gray-50 flex flex-col">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-emerald-600" />
                        Quick Analytics
                      </h4>
                      
                      {/* Mini Chart */}
                      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                        <div className="flex items-end justify-between h-24 gap-1">
                          {[...Array(7)].map((_, i) => {
                            const height = Math.random() * 80 + 20
                            return (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 + i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t"
                              />
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Last 7 days</span>
                          <span className="text-xs font-bold text-emerald-600">
                            +{Math.floor(Math.random() * 20 + 5)}%
                          </span>
                        </div>
                      </div>

                      {/* Activity Feed */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>{Math.floor(Math.random() * 10 + 1)} new enrollments today</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>{Math.floor(Math.random() * 5 + 1)} lessons completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span>{Math.floor(Math.random() * 3 + 1)} new reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link href={`/instructor/courses/${course.id}/edit`} className="block">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold shadow-lg">
                          <Edit className="w-4 h-4" />
                          Edit Course
                        </button>
                      </Link>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourse(course)
                            setShowQuickView(true)
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleToggleStatus(course.id, course.status)}
                          disabled={actionLoading === course.id}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            course.status === 'PUBLISHED'
                              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {actionLoading === course.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : course.status === 'PUBLISHED' ? (
                            <>
                              <Archive className="w-4 h-4" />
                              Draft
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Publish
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setCourseToDelete(course.id)
                            setShowDeleteModal(true)
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <div className="relative w-48 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl overflow-hidden flex-shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-emerald-600/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {course.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              course.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                        {course.category && (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            {course.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${course.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">per student</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-semibold">{course.students} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-semibold">{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="font-semibold">${(course.price * course.students).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/instructor/courses/${course.id}/edit`}>
                          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-semibold">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(course.id, course.status)}
                          disabled={actionLoading === course.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                            course.status === 'PUBLISHED'
                              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {actionLoading === course.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : course.status === 'PUBLISHED' ? (
                            <>
                              <Archive className="w-4 h-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Publish
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setCourseToDelete(course.id)
                            setShowDeleteModal(true)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery || filterStatus !== 'all' ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'Start creating your first course to share your knowledge with students around the world'}
          </p>
          <Link href="/instructor/courses/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Create Your First Course
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Delete Course?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this course? This action cannot be undone and all associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => courseToDelete && handleDeleteCourse(courseToDelete)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div
              className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && selectedCourse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowQuickView(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                          selectedCourse.status === 'PUBLISHED'
                            ? 'bg-white/20'
                            : 'bg-gray-900/20'
                        }`}
                      >
                        {selectedCourse.status}
                      </span>
                    </div>
                    {selectedCourse.category && (
                      <span className="text-sm text-emerald-100">
                        {selectedCourse.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Thumbnail */}
                <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden mb-6">
                  {selectedCourse.thumbnail ? (
                    <img
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-emerald-600/30" />
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedCourse.students}</p>
                    <p className="text-xs text-gray-600">Students Enrolled</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
                    <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedCourse.lessons}</p>
                    <p className="text-xs text-gray-600">Total Lessons</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center border border-yellow-200">
                    <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedCourse.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Average Rating</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">${(selectedCourse.price * selectedCourse.students).toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Total Revenue</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Course Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedCourse.description || 'No description available for this course.'}
                  </p>
                </div>

                {/* Performance Insights */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    Performance Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                        <Target className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">
                        {Math.floor(Math.random() * 30 + 60)}%
                      </p>
                      <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 30 + 60)}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Engagement</span>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.floor(Math.random() * 20 + 70)}%
                      </p>
                      <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 20 + 70)}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Satisfaction</span>
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.floor(Math.random() * 15 + 80)}%
                      </p>
                      <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 15 + 80)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={`/instructor/courses/${selectedCourse.id}/edit`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold shadow-lg">
                      <Edit className="w-5 h-5" />
                      Edit Course
                    </button>
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                    <Download className="w-5 h-5" />
                    Export
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

