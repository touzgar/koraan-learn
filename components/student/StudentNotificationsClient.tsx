'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle, Award, MessageCircle, BookOpen, Clock, Trash2, Loader2, TrendingUp, Filter, X } from 'lucide-react'

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

export default function StudentNotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterRead, setFilterRead] = useState<string>('all')

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

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { 
      Award, 
      BookOpen, 
      MessageCircle, 
      Clock, 
      CheckCircle,
      TrendingUp,
    }
    return icons[iconName] || Bell
  }

  const filteredNotifications = notifications.filter(n => {
    const typeMatch = filterType === 'all' || n.type === filterType
    const readMatch = filterRead === 'all' || 
      (filterRead === 'unread' && !n.read) || 
      (filterRead === 'read' && n.read)
    return typeMatch && readMatch
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const types = ['all', ...Array.from(new Set(notifications.map(n => n.type)))]

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
              <div className="relative">
                <Bell className="w-10 h-10" />
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold">Notifications</h1>
                <p className="text-emerald-100 text-lg">Stay updated with your activities</p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all font-semibold"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl transition-all font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl font-bold">{notifications.length}</p>
              <p className="text-emerald-100 text-sm">Total Notifications</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl font-bold">{unreadCount}</p>
              <p className="text-emerald-100 text-sm">Unread</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl font-bold">{notifications.filter(n => n.type === 'achievement').length}</p>
              <p className="text-emerald-100 text-sm">Achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-600 flex-shrink-0">Type:</span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">Status:</span>
          {['all', 'unread', 'read'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterRead(status)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filterRead === status
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => {
            const Icon = getIconComponent(notification.icon)
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl group ${
                  notification.read ? 'border-gray-100' : 'border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-teal-50/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    notification.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                    notification.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                    notification.color === 'teal' ? 'bg-gradient-to-br from-teal-500 to-cyan-600' :
                    'bg-gradient-to-br from-green-500 to-emerald-600'
                  }`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        notification.type === 'achievement' ? 'bg-amber-100 text-amber-700' :
                        notification.type === 'completion' ? 'bg-green-100 text-green-700' :
                        notification.type === 'course' ? 'bg-teal-100 text-teal-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{notification.time}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center shadow-xl border-2 border-gray-100">
          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {notifications.length === 0 ? "No Notifications" : "No Matching Notifications"}
          </h3>
          <p className="text-gray-600 mb-6">
            {notifications.length === 0 
              ? "You're all caught up! Check back later for updates." 
              : "Try adjusting your filters to see more notifications."}
          </p>
          {filterType !== 'all' || filterRead !== 'all' ? (
            <button 
              onClick={() => {
                setFilterType('all')
                setFilterRead('all')
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
