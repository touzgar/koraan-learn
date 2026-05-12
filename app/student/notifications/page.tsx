'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle, Award, MessageCircle, BookOpen, Clock, Trash2, Loader2 } from 'lucide-react'

interface Notification {
  id: string
  type: 'achievement' | 'course' | 'message' | 'reminder' | 'completion'
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  color: string
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/student/notifications')
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const markAllAsRead = async () => {
    try {
      await fetch('/api/student/notifications/mark-read', { method: 'POST' })
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/student/notifications/${id}`, { method: 'DELETE' })
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Award, BookOpen, MessageCircle, Clock, CheckCircle }
    return icons[iconName] || Bell
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">Stay updated with your learning activities</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-semibold"
          >
            <CheckCircle className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIconComponent(notification.icon)
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl ${
                  notification.read ? 'border-gray-100' : 'border-emerald-200 bg-emerald-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.color === 'amber' ? 'bg-amber-100' :
                    notification.color === 'emerald' ? 'bg-emerald-100' :
                    notification.color === 'teal' ? 'bg-teal-100' :
                    'bg-green-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      notification.color === 'amber' ? 'text-amber-600' :
                      notification.color === 'emerald' ? 'text-emerald-600' :
                      notification.color === 'teal' ? 'text-teal-600' :
                      'text-green-600'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>

                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <Bell className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}
