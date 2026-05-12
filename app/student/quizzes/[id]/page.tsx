'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Trophy,
  Target,
  BookOpen,
  Send
} from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string | null
  position: number
}

interface QuizDetail {
  id: string
  title: string
  description: string | null
  course: string
  courseId: string
  passingScore: number
  questions: Question[]
  duration: number
  attempts: number
  lastScore: number | null
  lastPassed: boolean | null
}

export default function QuizTakePage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/student/quizzes/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setQuiz(data.quiz)
          setTimeLeft(data.quiz.duration * 60) // Convert to seconds
        } else {
          router.push('/student/quizzes')
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error)
        router.push('/student/quizzes')
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [params.id, router])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit() // Auto-submit when time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResults])

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }))
  }

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quiz) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/student/quizzes/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
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

  // Results View
  if (showResults && results) {
    const passed = results.score >= quiz.passingScore

    return (
      <div className="space-y-6">
        <Link href="/student/quizzes">
          <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Quizzes</span>
          </button>
        </Link>

        {/* Results Header */}
        <div className={`rounded-3xl p-8 text-white shadow-xl ${
          passed 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : 'bg-gradient-to-r from-red-600 to-orange-600'
        }`}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {passed ? (
                <Trophy className="w-12 h-12" />
              ) : (
                <Target className="w-12 h-12" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
            </h1>
            <p className="text-xl mb-6">
              {passed 
                ? 'You passed the quiz!'
                : 'You can retake this quiz to improve your score'}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
                <p className="text-5xl font-bold">{results.score}%</p>
                <p className="text-sm mt-1">Your Score</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
                <p className="text-5xl font-bold">{quiz.passingScore}%</p>
                <p className="text-sm mt-1">Required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Details */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm text-gray-600">Correct</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{results.correctAnswers}</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-sm text-gray-600">Incorrect</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{results.incorrectAnswers}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{quiz.questions.length}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/student/quizzes" className="flex-1">
              <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold">
                Back to Quizzes
              </button>
            </Link>
            {!passed && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Quiz Taking View
  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <div className="space-y-6">
      <Link href="/student/quizzes">
        <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Quizzes</span>
        </button>
      </Link>

      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-emerald-100">{quiz.course}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{timeLeft !== null ? formatTime(timeLeft) : '--:--'}</p>
            <p className="text-xs text-emerald-100">Time Left</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-emerald-100">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8">
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{currentQuestion + 1}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {question.question}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === option
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    <span className={`text-lg ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < quiz.questions.length}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Warning if not all answered */}
        {currentQuestion === quiz.questions.length - 1 && answeredCount < quiz.questions.length && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Not all questions answered</p>
              <p className="text-sm text-amber-700">
                You have answered {answeredCount} out of {quiz.questions.length} questions. 
                Please answer all questions before submitting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Question Navigator</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-full aspect-square rounded-lg font-semibold transition-all ${
                index === currentQuestion
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg'
                  : answers[index]
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
