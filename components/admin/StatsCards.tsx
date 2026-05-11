'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, UserCheck, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stat {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down'
  icon: string
}

interface StatsCardsProps {
  stats: Stat[]
}

const iconMap = {
  users: Users,
  courses: BookOpen,
  enrollments: UserCheck,
  revenue: DollarSign,
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap]
        const isPositive = stat.trend === 'up'

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-900/5 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                'p-3 rounded-xl transition-all duration-300',
                'bg-gradient-to-br from-emerald-50 to-emerald-100 group-hover:from-emerald-100 group-hover:to-emerald-200'
              )}>
                <Icon className="w-6 h-6 text-emerald-700" />
              </div>
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                isPositive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              )}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
