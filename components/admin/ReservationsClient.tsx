'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter,
  Download,
  Eye,
  X,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Reservation {
  id: string
  status: string
  progress: number
  enrolledAt: Date
  completedAt: Date | null
  student: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    imageUrl: string | null
  }
  course: {
    id: string
    title: string
    price: number
    instructor: {
      firstName: string | null
      lastName: string | null
    }
  }
}

interface Course {
  id: string
  title: string
}

interface Student {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
}

interface ReservationsClientProps {
  reservations: Reservation[]
  courses: Course[]
  students: Student[]
}

export default function ReservationsClient({ reservations, courses, students }: ReservationsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [courseFilter, setCourseFilter] = useState<string>('ALL')
  const [studentFilter, setStudentFilter] = useState<string>('ALL')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(false)

  // Filter reservations
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = 
      reservation.student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || reservation.status === statusFilter
    const matchesCourse = courseFilter === 'ALL' || reservation.course.id === courseFilter
    const matchesStudent = studentFilter === 'ALL' || reservation.student.id === studentFilter
    
    return matchesSearch && matchesStatus && matchesCourse && matchesStudent
  })

  // Calculate statistics
  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'ACTIVE').length,
    completed: reservations.filter(r => r.status === 'COMPLETED').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
    totalRevenue: reservations
      .filter(r => r.status !== 'CANCELLED')
      .reduce((sum, r) => sum + r.course.price, 0),
    avgProgress: reservations.length > 0
      ? reservations.reduce((sum, r) => sum + r.progress, 0) / reservations.length
      : 0,
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error updating status')
      }
    } catch (error) {
      alert('Error updating status')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Student', 'Email', 'Course', 'Status', 'Progress', 'Enrolled Date', 'Price'],
      ...filteredReservations.map(r => [
        `${r.student.firstName} ${r.student.lastName}`,
        r.student.email,
        r.course.title,
        r.status,
        `${r.progress}%`,
        format(new Date(r.enrolledAt), 'yyyy-MM-dd'),
        `${r.course.price}€`,
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reservations-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Clock className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations Management</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage all course enrollments</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total</p>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active</p>
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completed</p>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Cancelled</p>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Revenue</p>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.totalRevenue}€</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Progress</p>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.avgProgress.toFixed(0)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <motion.tr
                  key={reservation.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-emerald-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {reservation.student.imageUrl ? (
                        <img
                          src={reservation.student.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                          {reservation.student.firstName?.[0]}{reservation.student.lastName?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reservation.student.firstName} {reservation.student.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{reservation.student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{reservation.course.title}</p>
                    <p className="text-xs text-gray-500">
                      by {reservation.course.instructor.firstName} {reservation.course.instructor.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{reservation.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{ width: `${reservation.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                      disabled={loading}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-500',
                        getStatusColor(reservation.status)
                      )}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-emerald-600">
                      {reservation.course.price}€
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{format(new Date(reservation.enrolledAt), 'MMM dd, yyyy')}</span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(reservation.enrolledAt), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reservations found</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Reservation Details</h2>
                  <button
                    onClick={() => setSelectedReservation(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Student Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      {selectedReservation.student.imageUrl ? (
                        <img
                          src={selectedReservation.student.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold">
                          {selectedReservation.student.firstName?.[0]}{selectedReservation.student.lastName?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedReservation.student.firstName} {selectedReservation.student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{selectedReservation.student.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-gray-900">{selectedReservation.course.title}</p>
                    <p className="text-sm text-gray-600">
                      Instructor: {selectedReservation.course.instructor.firstName} {selectedReservation.course.instructor.lastName}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      Price: {selectedReservation.course.price}€
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progress
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion</span>
                      <span className="text-lg font-bold text-emerald-600">{selectedReservation.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                        style={{ width: `${selectedReservation.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status & Dates */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Status & Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={cn('px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1', getStatusColor(selectedReservation.status))}>
                        {getStatusIcon(selectedReservation.status)}
                        {selectedReservation.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enrolled:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {format(new Date(selectedReservation.enrolledAt), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                    {selectedReservation.completedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completed:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(selectedReservation.completedAt), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
