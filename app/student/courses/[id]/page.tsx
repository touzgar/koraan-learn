'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  CheckCircle,
  Clock,
  Award,
  Star,
  Download,
  Share2,
  Lock,
  Video,
  FileText,
  Loader2,
  TrendingUp,
  Target,
  Calendar,
  User,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  duration: number | null
  position: number
  isCompleted: boolean
  isLocked: boolean
  videoUrl: string | null
  pdfUrl: string | null
  isFree: boolean
}

interface CourseDetail {
  id: string
  title: string
  description: string | null
  instructor: string
  category: string
  imageUrl: string | null
  progress: number
  totalLessons: number
  completedLessons: number
  enrolledAt: string
  status: 'in-progress' | 'completed'
  lessons: Lesson[]
  estimatedTime: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`/api/student/courses/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCourse(data.course)
        } else {
          router.push('/student/courses')
        }
      } catch (error) {
        console.error('Failed to fetch course:', error)
        router.push('/student/courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourseDetail()
  }, [params.id, router])

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }

  const handleStartLesson = (lessonId: string) => {
    router.push(`/student/lessons/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Course not found</p>
      </div>
    )
  }

  const nextLesson = course.lessons.find(l => !l.isCompleted && !l.isLocked)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/student/courses">
        <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </button>
      </Link>

      {/* Course Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/20 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                    {course.category}
                  </span>
                  {course.status === 'completed' && (
                    <span className="px-4 py-1.5 bg-green-500 rounded-full text-sm font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                {course.description && (
                  <p className="text-emerald-100 text-lg leading-relaxed">{course.description}</p>
                )}
              </div>

              <div className="flex items-center gap-6 text-emerald-100">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.estimatedTime || 0} hours</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Progress
                  </h3>
                  <span className="text-3xl font-bold">{course.progress}%</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${course.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Completed</p>
                    <p className="text-2xl font-bold">{course.completedLessons}</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Remaining</p>
                    <p className="text-2xl font-bold">{course.totalLessons - course.completedLessons}</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total</p>
                    <p className="text-2xl font-bold">{course.totalLessons}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="space-y-4">
              {nextLesson && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Continue Learning
                  </h3>
                  <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <p className="text-sm text-emerald-100 mb-2">Next Lesson</p>
                    <p className="font-semibold mb-3">{nextLesson.title}</p>
                    {nextLesson.duration && (
                      <div className="flex items-center gap-2 text-sm text-emerald-100">
                        <Clock className="w-4 h-4" />
                        <span>{nextLesson.duration} min</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleStartLesson(nextLesson.id)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-bold shadow-lg"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Lesson
                  </button>
                </div>
              )}

              {course.status === 'completed' && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certificate
                  </h3>
                  <p className="text-emerald-100 text-sm mb-4">
                    Congratulations! You've completed this course.
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-bold shadow-lg">
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </button>
                </div>
              )}

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-bold mb-4">Course Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Enrolled</span>
                    <span className="font-semibold">{new Date(course.enrolledAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Status</span>
                    <span className="font-semibold capitalize">{course.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="w-7 h-7 text-emerald-600" />
            Course Content
          </h2>
          <p className="text-gray-600 mt-1">
            {course.completedLessons} of {course.totalLessons} lessons completed
          </p>
        </div>

        <div className="p-8">
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  lesson.isCompleted
                    ? 'border-green-200 bg-green-50/50'
                    : lesson.isLocked
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-lg'
                }`}
              >
                <button
                  onClick={() => !lesson.isLocked && toggleSection(index)}
                  className="w-full px-6 py-5 flex items-center justify-between"
                  disabled={lesson.isLocked}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Lesson Number/Status */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      lesson.isCompleted
                        ? 'bg-green-500 text-white'
                        : lesson.isLocked
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    }`}>
                      {lesson.isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : lesson.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 text-left">
                      <h3 className={`font-bold text-lg mb-1 ${
                        lesson.isLocked ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {lesson.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration} min</span>
                          </div>
                        )}
                        {lesson.videoUrl && (
                          <div className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            <span>Video</span>
                          </div>
                        )}
                        {lesson.pdfUrl && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>Resources</span>
                          </div>
                        )}
                        {lesson.isFree && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                            Free Preview
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {!lesson.isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartLesson(lesson.id)
                        }}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          lesson.isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg'
                        }`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        {lesson.isCompleted ? 'Review' : 'Start'}
                      </button>
                    )}

                    {/* Expand Icon */}
                    {!lesson.isLocked && lesson.description && (
                      <div>
                        {expandedSections.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded Description */}
                {expandedSections.has(index) && lesson.description && !lesson.isLocked && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <p className="text-gray-600 mt-4 leading-relaxed">{lesson.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
