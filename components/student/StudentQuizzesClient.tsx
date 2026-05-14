'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Target,
  PlayCircle,
  Award,
  Loader2,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react'

interface Quiz {
  id: string
  title: string
  description: string | null
  course: string
  courseId: string
  category: string
  questions: number
  passingScore: number
  duration: number
  status: 'available' | 'completed' | 'failed'
  score: number | null
  attempts: number
  passed: boolean
  completedDate: string | null
}

export default function StudentQuizzesClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/student/quizzes')
        if (response.ok) {
          const data = await response.json()
          setQuizzes(data.quizzes || [])
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.course.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: quizzes.length,
    completed: quizzes.filter(q => q.status === 'completed').length,
    passed: quizzes.filter(q => q.passed === true).length,
    avgScore: quizzes.filter(q => q.score !== null).length > 0
      ? Math.round(
          quizzes.filter(q => q.score !== null).reduce((sum, q) => sum + (q.score || 0), 0) /
          quizzes.filter(q => q.score !== null).length
        )
      : 0
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
        <h1 className="text-4xl font-bold mb-2">My Quizzes</h1>
        <p className="text-emerald-100 text-lg">
          Test your knowledge and track your performance
        </p>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Quizzes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.passed}</p>
              <p className="text-sm text-gray-600">Passed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Search */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all"
            >
              {/* Header */}
              <div className={`p-6 ${
                quiz.status === 'completed' && quiz.passed
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                  : quiz.status === 'failed'
                  ? 'bg-gradient-to-r from-red-50 to-orange-50'
                  : 'bg-gradient-to-r from-emerald-50 to-teal-50'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.course}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ml-3 ${
                    quiz.status === 'completed' && quiz.passed
                      ? 'bg-green-500'
                      : quiz.status === 'failed'
                      ? 'bg-red-500'
                      : 'bg-emerald-500'
                  }`}>
                    {quiz.status === 'completed' && quiz.passed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : quiz.status === 'failed' ? (
                      <XCircle className="w-6 h-6 text-white" />
                    ) : (
                      <ClipboardList className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.duration} min</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {quiz.score !== null && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Your Score</span>
                      <span className={`text-2xl font-bold ${
                        quiz.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quiz.score}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          quiz.passed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-red-500 to-orange-600'
                        }`}
                        style={{ width: `${quiz.score}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Attempts: {quiz.attempts}</span>
                  <span>Pass: {quiz.passingScore}%</span>
                </div>

                {quiz.status === 'available' ? (
                  <Link href={`/student/quizzes/${quiz.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold">
                      <PlayCircle className="w-5 h-5" />
                      Start Quiz
                    </button>
                  </Link>
                ) : quiz.status === 'failed' ? (
                  <Link href={`/student/quizzes/${quiz.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all font-semibold">
                      <TrendingUp className="w-5 h-5" />
                      Retake Quiz
                    </button>
                  </Link>
                ) : (
                  <div className="flex gap-2">
                    <Link href={`/student/quizzes/${quiz.id}/results`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-semibold">
                        <Award className="w-4 h-4" />
                        Results
                      </button>
                    </Link>
                    <Link href={`/student/quizzes/${quiz.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        Retake
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <ClipboardList className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search'
              : 'Quizzes will appear here when your instructors create them'}
          </p>
          {!searchQuery && (
            <Link href="/student/courses">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
