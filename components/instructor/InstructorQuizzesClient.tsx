'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ClipboardList,
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  Target,
  BarChart3,
  Filter,
} from 'lucide-react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description: string | null
  course: string
  courseId: string
  questions: number
  attempts: number
  passRate: number
  passingScore: number
}

export default function InstructorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchQuizzes()
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

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/instructor/quizzes')
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data.quizzes)
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/instructor/quizzes/${quizId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setQuizzes(quizzes.filter((q) => q.id !== quizId))
        setShowDeleteModal(false)
        setQuizToDelete(null)
        showToast('Quiz deleted successfully', 'success')
      } else {
        showToast('Failed to delete quiz', 'error')
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error)
      showToast('Failed to delete quiz', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats
  const totalQuizzes = quizzes.length
  const totalQuestions = quizzes.reduce((sum, q) => sum + q.questions, 0)
  const totalAttempts = quizzes.reduce((sum, q) => sum + q.attempts, 0)
  const avgPassingScore = quizzes.length > 0
    ? Math.round(quizzes.reduce((sum, q) => sum + q.passingScore, 0) / quizzes.length)
    : 0

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
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-1">Create and manage course quizzes</p>
        </div>
        <Link href="/instructor/quizzes/create">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </motion.button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold mb-1">Total Quizzes</p>
              <p className="text-3xl font-bold text-purple-900">{totalQuizzes}</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-purple-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-1">Total Questions</p>
              <p className="text-3xl font-bold text-blue-900">{totalQuestions}</p>
            </div>
            <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-blue-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-semibold mb-1">Total Attempts</p>
              <p className="text-3xl font-bold text-emerald-900">{totalAttempts}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-emerald-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-semibold mb-1">Avg Pass Score</p>
              <p className="text-3xl font-bold text-orange-900">{avgPassingScore}%</p>
            </div>
            <div className="w-14 h-14 bg-orange-200 rounded-2xl flex items-center justify-center">
              <Target className="w-7 h-7 text-orange-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes by title or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  <Target className="w-3 h-3" />
                  {quiz.passingScore}% to pass
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1 font-medium">{quiz.course}</p>
              {quiz.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{quiz.description}</p>
              )}

              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="text-lg font-bold text-gray-900">{quiz.questions}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs text-gray-500">Attempts</p>
                  <p className="text-lg font-bold text-gray-900">{quiz.attempts}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500">Pass Rate</p>
                  <p className="text-lg font-bold text-gray-900">{quiz.passRate}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/instructor/quizzes/${quiz.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-semibold">
                    <ClipboardList className="w-4 h-4" />
                    View
                  </button>
                </Link>
                <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-semibold">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setQuizToDelete(quiz.id)
                    setShowDeleteModal(true)
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? 'No quizzes found' : 'No quizzes yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search to find what you\'re looking for'
              : 'Create quizzes to test your students\' knowledge and track their progress'}
          </p>
          <Link href="/instructor/quizzes/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Create Your First Quiz
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
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Quiz?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this quiz? This will also delete all questions and
                student attempts. This action cannot be undone.
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
                  onClick={() => quizToDelete && handleDeleteQuiz(quizToDelete)}
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
                toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
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


