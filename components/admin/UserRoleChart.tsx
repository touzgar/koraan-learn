'use client'

import { motion } from 'framer-motion'
import { UserRole } from '@prisma/client'
import { Shield, GraduationCap, User } from 'lucide-react'

interface UserRoleData {
  role: UserRole
  _count: number
}

interface UserRoleChartProps {
  data: UserRoleData[]
}

const roleConfig = {
  ADMIN: {
    label: 'Administrateurs',
    icon: Shield,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  INSTRUCTOR: {
    label: 'Formateurs',
    icon: GraduationCap,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  STUDENT: {
    label: 'Étudiants',
    icon: User,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
  },
}

export default function UserRoleChart({ data }: UserRoleChartProps) {
  const total = data.reduce((sum, item) => sum + item._count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-900/5 border border-emerald-100"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Répartition des Utilisateurs
      </h2>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const config = roleConfig[item.role]
          const Icon = config.icon
          const percentage = total > 0 ? (item._count / total) * 100 : 0

          return (
            <div key={item.role} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${config.lightColor}`}>
                    <Icon className={`w-4 h-4 ${config.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {item._count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  className={`h-full ${config.color} rounded-full`}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-emerald-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Total Utilisateurs
          </span>
          <span className="text-2xl font-bold text-emerald-700">
            {total}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
