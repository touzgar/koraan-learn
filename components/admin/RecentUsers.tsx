'use client'

import { motion } from 'framer-motion'
import { UserRole } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Shield, GraduationCap, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentUser {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  role: UserRole
  imageUrl: string | null
  createdAt: Date
  isActive: boolean
}

interface RecentUsersProps {
  users: RecentUser[]
}

const roleConfig = {
  ADMIN: {
    label: 'Admin',
    icon: Shield,
    color: 'text-purple-700 bg-purple-100',
  },
  INSTRUCTOR: {
    label: 'Formateur',
    icon: GraduationCap,
    color: 'text-blue-700 bg-blue-100',
  },
  STUDENT: {
    label: 'Étudiant',
    icon: User,
    color: 'text-emerald-700 bg-emerald-100',
  },
}

export default function RecentUsers({ users }: RecentUsersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-900/5 border border-emerald-100"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Utilisateurs Récents
      </h2>
      <div className="space-y-4">
        {users.map((user, index) => {
          const config = roleConfig[user.role]
          const RoleIcon = config.icon

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <div className="relative">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
                {!user.isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                  config.color
                )}>
                  <RoleIcon className="w-3 h-3" />
                  {config.label}
                </div>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
