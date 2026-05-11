'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Bell,
  BookOpenCheck,
  Building2,
  CalendarCheck,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
  user: any
  pendingNotifications: number
  totalSpaces: number
  todayReservations: number
}

export default function AdminSidebar({ user, pendingNotifications, totalSpaces, todayReservations }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/sign-in')
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      badge: null,
    },
    {
      title: 'Spaces',
      icon: Building2,
      href: '/admin/spaces',
      badge: totalSpaces > 0 ? totalSpaces.toString() : null,
    },
    {
      title: 'Reservations',
      icon: CalendarCheck,
      href: '/admin/reservations',
      badge: todayReservations > 0 ? todayReservations.toString() : null,
    },
    {
      title: 'Calendar',
      icon: Calendar,
      href: '/admin/calendar',
      badge: null,
    },
    {
      title: 'Users',
      icon: Users,
      href: '/admin/users',
      badge: null,
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      badge: null,
    },
    {
      title: 'Notifications',
      icon: Bell,
      href: '/admin/notifications',
      badge: pendingNotifications > 0 ? pendingNotifications.toString() : null,
    },
  ]

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-72 bg-white border-r border-emerald-100 shadow-xl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-emerald-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
              <div className="absolute inset-0 bg-emerald-600 rounded-xl" />
              <BookOpenCheck className="relative w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-emerald-900">
                KoraanLearn
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                Admin Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-emerald-100 bg-gradient-to-br from-emerald-50 to-transparent">
          <div className="flex items-center gap-3">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-emerald-600 font-medium">
                Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <Icon className={cn(
                  'w-5 h-5 relative z-10 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-emerald-600'
                )} />
                <span className="relative z-10 flex-1">{item.title}</span>
                {item.badge && (
                  <span className={cn(
                    'relative z-10 px-2 py-0.5 text-xs font-bold rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-700'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-emerald-100 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 rounded-xl font-medium transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 rounded-xl font-medium transition-all duration-200 group"
          >
            <BookOpenCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
