'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Mail,
  User,
  TrendingUp,
  Loader2,
  Users as UsersIcon,
  Download,
  BookOpen,
  Award,
  Clock,
  Eye,
  X,
  CheckCircle,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  progress: number
  lastActive: string
  courses?: {
    id: string
    title: string
    progress: number
    status: string
    enrolledAt: string
  }[]
}

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/instructor/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentDetails = async (studentId: string) => {
    try {
      const res = await fetch(`/api/instructor/students/${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedStudent(data.student)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error('Failed to fetch student details:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Enrolled Courses', 'Completed Courses', 'Progress', 'Last Active']
    const rows = filteredStudents.map((s) => [
      s.name,
      s.email,
      s.enrolledCourses,
      s.completedCourses,
      `${s.progress}%`,
      s.lastActive,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && student.progress > 0 && student.progress < 100) ||
      (filterStatus === 'completed' && student.completedCourses > 0)

    return matchesSearch && matchesFilter
  })

  // Calculate stats
  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.progress > 0 && s.progress < 100).length
  const avgProgress =
    students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length) : 0
  const completionRate =
    students.length > 0
      ? Math.round((students.filter((s) => s.completedCourses > 0).length / students.length) * 100)
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
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage and track your students' progress</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-1">Total Students</p>
              <p className="text-3xl font-bold text-blue-900">{totalStudents}</p>
            </div>
            <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center">
              <UsersIcon className="w-7 h-7 text-blue-700" />
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
              <p className="text-sm text-emerald-600 font-semibold mb-1">Active Students</p>
              <p className="text-3xl font-bold text-emerald-900">{activeStudents}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-emerald-700" />
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
              <p className="text-sm text-purple-600 font-semibold mb-1">Avg. Progress</p>
              <p className="text-3xl font-bold text-purple-900">{avgProgress}%</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-purple-700" />
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
              <p className="text-sm text-orange-600 font-semibold mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-orange-900">{completionRate}%</p>
            </div>
            <div className="w-14 h-14 bg-orange-200 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-orange-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Enrolled
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Completed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">{student.enrolledCourses}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-gray-900">{student.completedCourses}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 min-w-[45px]">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{student.lastActive}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => fetchStudentDetails(student.id)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`mailto:${student.email}`}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
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
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UsersIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search or filter criteria'
              : 'Students will appear here when they enroll in your courses'}
          </p>
        </motion.div>
      )}

      {/* Student Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Student Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Enrolled</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedStudent.enrolledCourses}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-600 font-semibold mb-1">Completed</p>
                  <p className="text-2xl font-bold text-emerald-900">{selectedStudent.completedCourses}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-900">{selectedStudent.progress}%</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              {selectedStudent.courses && selectedStudent.courses.length > 0 ? (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Enrolled Courses</h4>
                  <div className="space-y-3">
                    {selectedStudent.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{course.title}</h5>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              course.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {course.progress}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Not enrolled in any courses yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This student hasn't enrolled in your courses
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

