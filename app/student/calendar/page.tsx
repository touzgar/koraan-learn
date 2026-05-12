'use client'

import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Clock, Video, ClipboardList, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface Event {
  id: string
  title: string
  type: 'lesson' | 'quiz' | 'live' | 'deadline'
  time: string
  date: string
  color: string
}

export default function StudentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

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

  const upcomingEvents = events.slice(0, 4)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          My Calendar
        </h1>
        <p className="text-gray-600 mt-1">Schedule and upcoming events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square p-2 border border-gray-100 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <span className="text-sm text-gray-700">{(i % 30) + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border-l-4 ${
                    event.color === 'emerald' ? 'bg-emerald-50 border-emerald-500' :
                    event.color === 'teal' ? 'bg-teal-50 border-teal-500' :
                    event.color === 'amber' ? 'bg-amber-50 border-amber-500' :
                    'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {event.type === 'lesson' && <Video className="w-5 h-5 text-emerald-600 mt-0.5" />}
                    {event.type === 'quiz' && <ClipboardList className="w-5 h-5 text-teal-600 mt-0.5" />}
                    {event.type === 'live' && <Video className="w-5 h-5 text-amber-600 mt-0.5" />}
                    {event.type === 'deadline' && <CalendarIcon className="w-5 h-5 text-red-600 mt-0.5" />}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
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
    </div>
  )
}
