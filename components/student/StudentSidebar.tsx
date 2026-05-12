'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  ClipboardList,
  TrendingUp,
  Award,
  Calendar,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  BookOpenCheck
} from 'lucide-react'

interface StudentSidebarProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
  { icon: BookOpen, label: 'My Courses', href: '/student/courses' },
  { icon: PlayCircle, label: 'Lessons', href: '/student/lessons' },
  { icon: ClipboardList, label: 'Quizzes', href: '/student/quizzes' },
  { icon: TrendingUp, label: 'Progress', href: '/student/progress' },
  { icon: Award, label: 'Certificates', href: '/student/certificates' },
  { icon: Calendar, label: 'Calendar', href: '/student/calendar' },
  { icon: Bell, label: 'Notifications', href: '/student/notifications' },
]

const bottomMenuItems = [
  { icon: MessageSquare, label: 'Messages', href: '/student/messages' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
]

export default function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-emerald-100 shadow-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-emerald-600 rounded-xl" />
                  <GraduationCap className="relative w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-emerald-900">
                    KoraanLearn
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">
                    Student Portal
                  </span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <div className="p-6 border-b border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate text-emerald-900">{user.firstName} {user.lastName}</h3>
                <p className="text-xs text-emerald-600 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200'
                        : 'text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Bottom Menu */}
          <div className="mt-8 pt-6 border-t border-emerald-100 space-y-1">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200'
                        : 'text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-emerald-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
