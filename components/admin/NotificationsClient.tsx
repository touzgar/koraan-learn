'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  UserPlus,
  BookOpen,
  GraduationCap,
  Award,
  XCircle,
  AlertTriangle,
  FileText,
  Filter,
  Check,
  Eye,
  Trash2,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: string
  title: string
  description: string
  details: string | null
  entityId: string | null
  entityType: string | null
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

interface NotificationsClientProps {
  notifications: Notification[]
  stats: {
    total: number
    newUsers: number
    newCourses: number
    newEnrollments: number
    completedEnrollments: number
    cancelledEnrollments: number
    inactiveUsers: number
    draftCourses: number
    unread: number
  }
}

type NotificationType = 'all' | 'users' | 'courses' | 'enrollments' | 'alerts'

export default function NotificationsClient({ notifications: initialNotifications, stats: initialStats }: NotificationsClientProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<NotificationType>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState(initialNotifications)
  const [loading, setLoading] = useState(false)

  // Map notification types to categories
  const getNotificationCategory = (type: string): NotificationType => {
    if (type === 'NEW_USER') return 'users'
    if (type === 'NEW_COURSE') return 'courses'
    if (type === 'NEW_ENROLLMENT' || type === 'COMPLETED_ENROLLMENT') return 'enrollments'
    if (type === 'CANCELLED_ENROLLMENT' || type === 'INACTIVE_USER' || type === 'DRAFT_COURSE') return 'alerts'
    return 'all'
  }

  // Filter notifications
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => getNotificationCategory(n.type) === filter)

  const getNotificationIcon = (type: string) => {
    const icons = {
      NEW_USER: UserPlus,
      NEW_COURSE: BookOpen,
      NEW_ENROLLMENT: GraduationCap,
      COMPLETED_ENROLLMENT: Award,
      CANCELLED_ENROLLMENT: XCircle,
      INACTIVE_USER: AlertTriangle,
      DRAFT_COURSE: FileText,
    }
    return icons[type as keyof typeof icons] || Bell
  }

  const getNotificationColor = (type: string) => {
    const colors = {
      NEW_USER: 'blue',
      NEW_COURSE: 'emerald',
      NEW_ENROLLMENT: 'purple',
      COMPLETED_ENROLLMENT: 'green',
      CANCELLED_ENROLLMENT: 'red',
      INACTIVE_USER: 'orange',
      DRAFT_COURSE: 'yellow',
    }
    return colors[type as keyof typeof colors] || 'blue'
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-500' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bg-emerald-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-500' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: 'bg-green-500' },
      red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: 'bg-red-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: 'bg-orange-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'bg-yellow-500' },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedNotifications(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set())
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)))
    }
  }

  const handleMarkAsRead = async () => {
    if (selectedNotifications.size === 0) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsRead',
          ids: Array.from(selectedNotifications),
        }),
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            selectedNotifications.has(n.id) ? { ...n, isRead: true } : n
          )
        )
        setSelectedNotifications(new Set())
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to mark as read')
      }
    } catch (error) {
      console.error('Error marking as read:', error)
      alert('Failed to mark as read')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedNotifications.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedNotifications.size} notification(s)?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          ids: Array.from(selectedNotifications),
        }),
      })

      if (response.ok) {
        // Remove deleted notifications from local state
        setNotifications(prev =>
          prev.filter(n => !selectedNotifications.has(n.id))
        )
        setSelectedNotifications(new Set())
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete notifications')
      }
    } catch (error) {
      console.error('Error deleting notifications:', error)
      alert('Failed to delete notifications')
    } finally {
      setLoading(false)
    }
  }

  const getActionUrl = (notification: Notification) => {
    const urls = {
      NEW_USER: '/admin/users',
      INACTIVE_USER: '/admin/users',
      NEW_COURSE: '/admin/spaces',
      DRAFT_COURSE: '/admin/spaces',
      NEW_ENROLLMENT: '/admin/reservations',
      COMPLETED_ENROLLMENT: '/admin/reservations',
      CANCELLED_ENROLLMENT: '/admin/reservations',
    }
    return urls[notification.type as keyof typeof urls] || '/admin'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">Stay updated with all platform activities</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedNotifications.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={handleMarkAsRead}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? 'Processing...' : 'Mark as Read'}
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </motion.div>
          )}
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-emerald-100">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">{notifications.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: 'All', value: initialStats.total, color: 'emerald', filter: 'all' as const },
          { label: 'Unread', value: initialStats.unread, color: 'red', filter: 'all' as const },
          { label: 'New Users', value: initialStats.newUsers, color: 'blue', filter: 'users' as const },
          { label: 'New Courses', value: initialStats.newCourses, color: 'purple', filter: 'courses' as const },
          { label: 'Enrollments', value: initialStats.newEnrollments, color: 'indigo', filter: 'enrollments' as const },
          { label: 'Completed', value: initialStats.completedEnrollments, color: 'green', filter: 'enrollments' as const },
          { label: 'Cancelled', value: initialStats.cancelledEnrollments, color: 'red', filter: 'alerts' as const },
          { label: 'Alerts', value: initialStats.inactiveUsers + initialStats.draftCourses, color: 'orange', filter: 'alerts' as const },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setFilter(stat.filter)}
            className={cn(
              'bg-white rounded-xl p-4 shadow-lg border transition-all hover:scale-105',
              filter === stat.filter ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-100'
            )}
          >
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              Showing {filteredNotifications.length} notifications
            </span>
          </div>
          
          <button
            onClick={handleSelectAll}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {selectedNotifications.size === filteredNotifications.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-lg border border-emerald-100 p-12 text-center"
            >
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No notifications found</p>
              <p className="text-sm text-gray-500 mt-1">All caught up!</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type)
              const color = getNotificationColor(notification.type)
              const colors = getColorClasses(color)
              const isSelected = selectedNotifications.has(notification.id)
              
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'bg-white rounded-xl shadow-lg border p-5 hover:shadow-xl transition-all',
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-100',
                    !notification.isRead && 'bg-blue-50/30'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleSelectNotification(notification.id)}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1',
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-gray-300 hover:border-emerald-500'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>

                    {/* Icon */}
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', colors.icon)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">{notification.title}</h3>
                            {!notification.isRead && (
                              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{notification.description}</p>
                          {notification.details && (
                            <p className="text-xs text-gray-500 mt-1">{notification.details}</p>
                          )}
                        </div>
                        
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => router.push(getActionUrl(notification))}
                        className={cn(
                          'mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors',
                          colors.bg,
                          colors.text,
                          'hover:opacity-80'
                        )}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
