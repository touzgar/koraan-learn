'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Edit,
  Loader2,
  ClipboardList,
  CheckCircle,
  XCircle,
  Users,
  Target,
  BarChart3,
  Award,
  Calendar,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface QuizDetails {
  id: string
  title: string
  description: string | null
  passingScore: number
  courseId: string
  createdAt: string
  updatedAt: string
  course: {
    id: string
    title: string
  }
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    explanation: string | null
    position: number
  }[]
  quizAttempts: {
    id: string
    score: number
    isPassed: boolean
    attemptedAt: string
    student: {
      firstName: string | null
      lastName: string | null
      email: string
    }
  }[]
}

export default function QuizDetailsPage() {
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<QuizDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizDetails()
  }, [quizId])

  const fetchQuizDetails = async () => {
    try {
      const res = await fetch(`/api/instructor/quizzes/${quizId}/details`)
      if (res.ok) {
        const data = await res.json()
        setQuiz(data.quiz)
      }
    } catch (error) {
      console.error('Failed to fetch quiz details:', error)
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

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Quiz not found</p>
      </div>
    )
  }

  const totalAttempts = quiz.quizAttempts.length
  const passedAttempts = quiz.quizAttempts.filter((a) => a.isPassed).length
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0
  const avgScore =
    totalAttempts > 0
      ? Math.round(quiz.quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/instructor/quizzes">
            <button className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-1">Quiz Details</p>
          </div>
        </div>
        <Link href={`/instructor/quizzes/${quiz.id}/edit`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Edit className="w-5 h-5" />
            Edit Quiz
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
              <p className="text-sm text-purple-600 font-semibold mb-1">Questions</p>
              <p className="text-3xl font-bold text-purple-900">{quiz.questions.length}</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-purple-700" />
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
              <p className="text-sm text-blue-600 font-semibold mb-1">Total Attempts</p>
              <p className="text-3xl font-bold text-blue-900">{totalAttempts}</p>
            </div>
            <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-700" />
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
              <p className="text-sm text-emerald-600 font-semibold mb-1">Pass Rate</p>
              <p className="text-3xl font-bold text-emerald-900">{passRate}%</p>
            </div>
            <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-700" />
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
              <p className="text-sm text-orange-600 font-semibold mb-1">Avg Score</p>
              <p className="text-3xl font-bold text-orange-900">{avgScore}%</p>
            </div>
            <div className="w-14 h-14 bg-orange-200 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-orange-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quiz Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quiz Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Course</p>
              <p className="text-lg font-semibold text-gray-900">{quiz.course.title}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Passing Score</p>
              <p className="text-lg font-semibold text-gray-900">{quiz.passingScore}%</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(quiz.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {quiz.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-700">{quiz.description}</p>
          </div>
        )}
      </motion.div>

      {/* Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Questions ({quiz.questions.length})</h2>
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-700">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900 mb-4">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          option === question.correctAnswer
                            ? 'bg-emerald-100 border-2 border-emerald-500'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        {option === question.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span
                          className={`${
                            option === question.correctAnswer
                              ? 'text-emerald-900 font-semibold'
                              : 'text-gray-700'
                          }`}
                        >
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-800">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Attempts */}
      {quiz.quizAttempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Attempts ({quiz.quizAttempts.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {quiz.quizAttempts
                  .sort(
                    (a, b) =>
                      new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
                  )
                  .slice(0, 10)
                  .map((attempt) => (
                    <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {attempt.student.firstName} {attempt.student.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{attempt.student.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold text-gray-900">
                          {Math.round(attempt.score)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {attempt.isPassed ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                            <XCircle className="w-4 h-4" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(attempt.attemptedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
