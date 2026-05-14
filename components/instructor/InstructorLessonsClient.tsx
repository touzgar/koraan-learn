'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Play,
  FileText,
  Video,
  Loader2,
  Clock,
  BookOpen,
  Filter,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  course: string
  courseId: string
  type: string
  duration: string | number
  order: number
  status: string
  isPublished: boolean
}

export default function InstructorLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchLessons()
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

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/instructor/lessons')
      if (res.ok) {
        const data = await res.json()
        setLessons(data.lessons)
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/instructor/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setLessons(lessons.filter((l) => l.id !== lessonId))
        setShowDeleteModal(false)
        setLessonToDelete(null)
        showToast('Lesson deleted successfully', 'success')
      } else {
        showToast('Failed to delete lesson', 'error')
      }
    } catch (error) {
      console.error('Failed to delete lesson:', error)
      showToast('Failed to delete lesson', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleTogglePublish = async (lessonId: string, currentStatus: boolean) => {
    setActionLoading(lessonId)
    try {
      const res = await fetch(`/api/instructor/lessons/${lessonId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      })

      if (res.ok) {
        setLessons(
          lessons.map((l) =>
            l.id === lessonId ? { ...l, isPublished: !currentStatus } : l
          )
        )
        showToast(
          `Lesson ${!currentStatus ? 'published' : 'unpublished'} successfully`,
          'success'
        )
      } else {
        showToast('Failed to update lesson status', 'error')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      showToast('Failed to update lesson status', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || lesson.type === filterType
    const matchesStatus = filterStatus === 'all' || lesson.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesType && matchesStatus
  })

  // Calculate stats
  const totalLessons = lessons.length
  const videoLessons = lessons.filter((l) => l.type === 'video').length
  const documentLessons = lessons.filter((l) => l.type === 'document').length
  const freeLessons = lessons.filter((l) => l.status === 'Free').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="text-gray-600 mt-1">Manage your course lessons</p>
        </div>
        <Link href="/instructor/lessons/create">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Lesson
          </motion.button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-1">Total Lessons</p>
              <p className="text-3xl font-bold text-blue-900">{totalLessons}</p>
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
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold mb-1">Video Lessons</p>
              <p className="text-3xl font-bold text-purple-900">{videoLessons}</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
              <Video className="w-7 h-7 text-purple-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-semibold mb-1">Documents</p>
              <p className="text-3xl font-bold text-orange-900">{documentLessons}</p>
            </div>
            <div className="w-14 h-14 bg-orange-200 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-orange-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-semibold mb-1">Free Lessons</p>
              <p className="text-3xl font-bold text-emerald-900">{freeLessons}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
              <Unlock className="w-7 h-7 text-emerald-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons by title or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      {filteredLessons.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Lesson
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLessons.map((lesson, index) => (
                  <motion.tr
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-emerald-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            lesson.type === 'video'
                              ? 'bg-blue-100 group-hover:bg-blue-200'
                              : 'bg-purple-100 group-hover:bg-purple-200'
                          } transition-colors`}
                        >
                          {lesson.type === 'video' ? (
                            <Video className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lesson.title}</p>
                          <p className="text-sm text-gray-500">Position: {lesson.order}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 font-medium">{lesson.course}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-gray-600 font-medium">
                        {lesson.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            lesson.status === 'Free'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {lesson.status}
                        </span>
                        {lesson.isPublished ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(lesson.id, lesson.isPublished)}
                          disabled={actionLoading === lesson.id}
                          className={`p-2 rounded-lg transition-colors ${
                            lesson.isPublished
                              ? 'hover:bg-orange-50 text-orange-600'
                              : 'hover:bg-blue-50 text-blue-600'
                          }`}
                          title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {actionLoading === lesson.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : lesson.isPublished ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>
                        <Link href={`/instructor/lessons/${lesson.id}/edit`}>
                          <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setLessonToDelete(lesson.id)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all'
              ? 'No lessons found'
              : 'No lessons yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'Start adding lessons to your courses to build engaging content for your students'}
          </p>
          <Link href="/instructor/lessons/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Add Your First Lesson
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
                Delete Lesson?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this lesson? This action cannot be undone and all
                associated data will be permanently removed.
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
                  onClick={() => lessonToDelete && handleDeleteLesson(lessonToDelete)}
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
    </div>
  )
}


