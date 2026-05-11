'use client'

import { Search, Bell, Settings, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  user: any
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/sign-in')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-sm"
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."  
              className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button className="relative p-2.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-lg">
            {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || ''}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
