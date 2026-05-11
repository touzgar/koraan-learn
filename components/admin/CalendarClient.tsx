'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  BookOpen,
  UserPlus,
  X,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { fr } from 'date-fns/locale'

interface Enrollment {
  id: string
  enrolledAt: Date
  status: string
  student: {
    firstName: string | null
    lastName: string | null
    email: string
    imageUrl: string | null
  }
  course: {
    title: string
    instructor: {
      firstName: string | null
      lastName: string | null
    }
  }
}

interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  role: string
  createdAt: Date
}

interface Course {
  id: string
  title: string
  status: string
  createdAt: Date
  instructor: {
    firstName: string | null
    lastName: string | null
  }
}

interface CalendarClientProps {
  enrollments: Enrollment[]
  users: User[]
  courses: Course[]
}

type EventType = 'enrollment' | 'user' | 'course'

interface CalendarEvent {
  id: string
  type: EventType
  date: Date
  title: string
  subtitle: string
  status?: string
  data: any
}

export default function CalendarClient({ enrollments, users, courses }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | 'all'>('all')

  // Convert all data to calendar events
  const allEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = []

    // Add enrollments
    enrollments.forEach(enrollment => {
      events.push({
        id: enrollment.id,
        type: 'enrollment',
        date: new Date(enrollment.enrolledAt),
        title: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        subtitle: enrollment.course.title,
        status: enrollment.status,
        data: enrollment,
      })
    })

    // Add users
    users.forEach(user => {
      events.push({
        id: user.id,
        type: 'user',
        date: new Date(user.createdAt),
        title: `${user.firstName} ${user.lastName}`,
        subtitle: `New ${user.role.toLowerCase()} joined`,
        data: user,
      })
    })

    // Add courses
    courses.forEach(course => {
      events.push({
        id: course.id,
        type: 'course',
        date: new Date(course.createdAt),
        title: course.title,
        subtitle: `by ${course.instructor.firstName} ${course.instructor.lastName}`,
        status: course.status,
        data: course,
      })
    })

    return events
  }, [enrollments, users, courses])

  // Filter events
  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === 'all') return allEvents
    return allEvents.filter(event => event.type === eventTypeFilter)
  }, [allEvents, eventTypeFilter])

  // Get calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.date), date))
  }

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Statistics
  const stats = {
    totalEvents: filteredEvents.length,
    enrollments: filteredEvents.filter(e => e.type === 'enrollment').length,
    users: filteredEvents.filter(e => e.type === 'user').length,
    courses: filteredEvents.filter(e => e.type === 'course').length,
  }

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'enrollment':
        return 'bg-emerald-500'
      case 'user':
        return 'bg-blue-500'
      case 'course':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'enrollment':
        return <CheckCircle className="w-4 h-4" />
      case 'user':
        return <UserPlus className="w-4 h-4" />
      case 'course':
        return <BookOpen className="w-4 h-4" />
      default:
        return <CalendarIcon className="w-4 h-4" />
    }
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-600 mt-1">Track all platform activities</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrollments</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.enrollments}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
            </div>
            <UserPlus className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Courses</p>
              <p className="text-2xl font-bold text-purple-600">{stats.courses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Show:</span>
          {[
            { value: 'all', label: 'All Events', icon: CalendarIcon },
            { value: 'enrollment', label: 'Enrollments', icon: CheckCircle },
            { value: 'user', label: 'Users', icon: UserPlus },
            { value: 'course', label: 'Courses', icon: BookOpen },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setEventTypeFilter(value as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                eventTypeFilter === value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isTodayDate = isToday(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <motion.button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative min-h-[120px] p-3 rounded-xl border-2 transition-all',
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                    isTodayDate && 'border-emerald-600 bg-emerald-50 shadow-lg',
                    isSelected && 'border-emerald-600 bg-emerald-100 shadow-xl',
                    !isTodayDate && !isSelected && 'border-gray-200 hover:border-emerald-300 hover:shadow-md',
                    !isCurrentMonth && 'opacity-40'
                  )}
                >
                  <div className="flex flex-col h-full">
                    {/* Date Number */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        'text-lg font-bold',
                        isTodayDate ? 'text-emerald-700' : 'text-gray-900'
                      )}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Events Preview */}
                    {dayEvents.length > 0 && (
                      <div className="flex-1 space-y-1">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={cn(
                              'text-left px-2 py-1 rounded text-xs font-medium truncate',
                              event.type === 'enrollment' && 'bg-emerald-100 text-emerald-700',
                              event.type === 'user' && 'bg-blue-100 text-blue-700',
                              event.type === 'course' && 'bg-purple-100 text-purple-700'
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 font-semibold text-center">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Events Modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy', { locale: fr })}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No events on this day</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Group events by type */}
                    {['enrollment', 'user', 'course'].map((type) => {
                      const typeEvents = selectedDateEvents.filter(e => e.type === type)
                      if (typeEvents.length === 0) return null

                      const typeLabels = {
                        enrollment: 'Enrollments',
                        user: 'New Users',
                        course: 'New Courses'
                      }

                      return (
                        <div key={type} className="space-y-2">
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            {getEventIcon(type as EventType)}
                            {typeLabels[type as keyof typeof typeLabels]} ({typeEvents.length})
                          </h3>
                          <div className="space-y-2">
                            {typeEvents.map((event, index) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                  'p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer',
                                  event.type === 'enrollment' && 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
                                  event.type === 'user' && 'bg-blue-50 border-blue-200 hover:border-blue-400',
                                  event.type === 'course' && 'bg-purple-50 border-purple-200 hover:border-purple-400'
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={cn(
                                    'p-2.5 rounded-xl text-white shadow-lg',
                                    getEventColor(event.type)
                                  )}>
                                    {getEventIcon(event.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
                                        <p className="text-sm text-gray-600 truncate">{event.subtitle}</p>
                                      </div>
                                      {event.status && (
                                        <span className={cn(
                                          'px-2.5 py-1 text-xs font-bold rounded-full whitespace-nowrap',
                                          event.status === 'ACTIVE' && 'bg-green-500 text-white',
                                          event.status === 'COMPLETED' && 'bg-blue-500 text-white',
                                          event.status === 'PUBLISHED' && 'bg-green-500 text-white',
                                          event.status === 'DRAFT' && 'bg-gray-400 text-white',
                                          event.status === 'CANCELLED' && 'bg-red-500 text-white'
                                        )}>
                                          {event.status}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        {format(new Date(event.date), 'HH:mm')}
                                      </div>
                                      {event.type === 'enrollment' && event.data.student && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                          <User className="w-3.5 h-3.5" />
                                          {event.data.student.email}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
