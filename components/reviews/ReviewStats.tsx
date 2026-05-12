'use client'

import { motion } from 'framer-motion'
import { 
  Star, MessageCircle, TrendingUp, Award, 
  Users, Clock, Target, Zap, ThumbsUp,
  BarChart3, Activity
} from 'lucide-react'

interface ReviewStatsProps {
  avgRating: number
  totalReviews: number
  positivePercentage: number
  responseRate: number
  trends?: {
    rating: number
    reviews: number
  }
}

export default function ReviewStats({ 
  avgRating, 
  totalReviews, 
  positivePercentage,
  responseRate,
  trends 
}: ReviewStatsProps) {
  
  const stats = [
    {
      id: 'rating',
      label: 'Average Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      gradient: 'from-emerald-500 to-teal-600',
      bgPattern: 'from-emerald-50 to-teal-50',
      trend: trends?.rating || 0,
      suffix: '',
      description: 'Overall satisfaction',
      showStars: true
    },
    {
      id: 'total',
      label: 'Total Reviews',
      value: totalReviews.toString(),
      icon: MessageCircle,
      gradient: 'from-blue-500 to-indigo-600',
      bgPattern: 'from-blue-50 to-indigo-50',
      trend: trends?.reviews || 12,
      suffix: '',
      description: 'Student feedback'
    },
    {
      id: 'positive',
      label: 'Positive Feedback',
      value: positivePercentage.toString(),
      icon: ThumbsUp,
      gradient: 'from-green-500 to-emerald-600',
      bgPattern: 'from-green-50 to-emerald-50',
      trend: 5,
      suffix: '%',
      description: 'Happy students'
    },
    {
      id: 'response',
      label: 'Response Rate',
      value: responseRate.toString(),
      icon: Target,
      gradient: 'from-purple-500 to-pink-600',
      bgPattern: 'from-purple-50 to-pink-50',
      trend: 3,
      suffix: '%',
      description: 'Engagement level'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgPattern} border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8">
                <Icon className="w-full h-full" />
              </div>
            </div>

            {/* Animated Background Gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Trend Badge */}
                {stat.trend !== undefined && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      stat.trend >= 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <TrendingUp className={`w-3 h-3 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(stat.trend)}%</span>
                  </motion.div>
                )}
              </div>

              {/* Value */}
              <div className="mb-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-baseline gap-1"
                >
                  <span className="text-4xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-2xl font-semibold text-gray-600">
                      {stat.suffix}
                    </span>
                  )}
                </motion.div>

                {/* Stars for Rating */}
                {stat.showStars && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + star * 0.05 }}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= avgRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Label & Description */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stat.id === 'rating' ? `${(avgRating / 5) * 100}%` : '100%' }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className={`h-full bg-gradient-to-r ${stat.gradient} relative`}
                >
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </div>
            </div>

            {/* Hover Effect Border */}
            <motion.div
              className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
