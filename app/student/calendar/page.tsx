'use client'

import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Clock, Video, ClipboardList, ChevronLeft, ChevronRight, Loader2, BookOpen, Filter } from 'lucide-react'

interface Event {
  id: string
  title: string
  type: 'lesson' | 'quiz' | 'live' | 'deadline'
  course: string
  time: string
  date: string
  duration: number
  color: string
  description: string
}

export default function StudentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/student/calendar')
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return dayNum
    }
    return null
  })

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
    return events.filter(e => new Date(e.date).toDateString() === dateStr)
  }

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(e => e.type === filterType)

  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.date) >= new Date())
    .slice(0, 10)

  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
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
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-10 h-10" />
              <div>
                <h1 className="text-4xl font-bold">My Calendar</h1>
                <p className="text-emerald-100 text-lg">Plan your learning journey</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  viewMode === 'month' ? 'bg-white text-emerald-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-emerald-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl font-bold">{todayEvents.length}</p>
              <p className="text-emerald-100 text-sm">Events Today</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl font-bold">{upcomingEvents.length}</p>
              <p className="text-emerald-100 text-sm">Upcoming Events</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl font-bold">{events.filter(e => e.type === 'lesson').length}</p>
              <p className="text-emerald-100 text-sm">Total Lessons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-gray-600" />
        {['all', 'lesson', 'quiz'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              filterType === type
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
          </button>
        ))}
      </div>

      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={previousMonth}
                  className="p-3 hover:bg-emerald-50 rounded-xl transition-all text-emerald-600 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-3 hover:bg-emerald-50 rounded-xl transition-all text-emerald-600 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-bold text-gray-600 py-3">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, i) => {
                const dayEvents = day ? getEventsForDate(day) : []
                const isToday = day === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                
                return (
                  <div
                    key={i}
                    className={`min-h-[80px] p-2 border rounded-xl transition-all cursor-pointer ${
                      !day ? 'bg-gray-50 border-gray-100' :
                      isToday ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-600 shadow-lg' :
                      dayEvents.length > 0 ? 'bg-emerald-50 border-emerald-200 hover:shadow-lg' :
                      'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    {day && (
                      <>
                        <span className={`text-sm font-semibold ${isToday ? 'text-white' : 'text-gray-700'}`}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs px-2 py-1 rounded ${
                                  isToday ? 'bg-white/30 text-white' :
                                  event.type === 'lesson' ? 'bg-emerald-200 text-emerald-800' :
                                  'bg-teal-200 text-teal-800'
                                }`}
                              >
                                {event.title.substring(0, 10)}...
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-600">+{dayEvents.length - 2} more</div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-emerald-600" />
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-lg cursor-pointer ${
                      event.type === 'lesson' ? 'bg-emerald-50 border-emerald-500' :
                      'bg-teal-50 border-teal-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {event.type === 'lesson' ? (
                        <Video className="w-5 h-5 text-emerald-600 mt-0.5" />
                      ) : (
                        <ClipboardList className="w-5 h-5 text-teal-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">{event.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{event.course}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: {event.duration} min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No upcoming events</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="p-6 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      event.type === 'lesson' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                      'bg-gradient-to-br from-teal-500 to-cyan-600'
                    }`}>
                      {event.type === 'lesson' ? (
                        <Video className="w-8 h-8 text-white" />
                      ) : (
                        <ClipboardList className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                          <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <BookOpen className="w-4 h-4" />
                            {event.course}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.type === 'lesson' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-teal-100 text-teal-700'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time} ({event.duration} min)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No events found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
