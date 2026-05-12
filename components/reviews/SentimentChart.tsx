'use client'

import { motion } from 'framer-motion'
import { Smile, Meh, Frown, TrendingUp, TrendingDown } from 'lucide-react'

interface SentimentChartProps {
  positive: number
  neutral: number
  negative: number
  total: number
  trend?: {
    positive: number
    neutral: number
    negative: number
  }
}

export default function SentimentChart({ positive, neutral, negative, total, trend }: SentimentChartProps) {
  const getPercentage = (value: number) => Math.round((value / total) * 100)

  const sentiments = [
    {
      type: 'positive',
      count: positive,
      percentage: getPercentage(positive),
      icon: Smile,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      trend: trend?.positive || 0
    },
    {
      type: 'neutral',
      count: neutral,
      percentage: getPercentage(neutral),
      icon: Meh,
      color: 'yellow',
      gradient: 'from-yellow-500 to-amber-600',
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      trend: trend?.neutral || 0
    },
    {
      type: 'negative',
      count: negative,
      percentage: getPercentage(negative),
      icon: Frown,
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      trend: trend?.negative || 0
    }
  ]

  return (
    <div className="space-y-4">
      {sentiments.map((sentiment, index) => {
        const Icon = sentiment.icon
        const TrendIcon = sentiment.trend >= 0 ? TrendingUp : TrendingDown
        
        return (
          <motion.div
            key={sentiment.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border ${sentiment.borderColor} bg-gradient-to-r ${sentiment.bgGradient} p-5 hover:shadow-lg transition-all duration-300`}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Icon className="w-full h-full" />
            </div>

            <div className="relative flex items-center justify-between">
              {/* Left Side - Icon & Info */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${sentiment.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                
                <div>
                  <h4 className="text-lg font-bold text-gray-900 capitalize mb-1">
                    {sentiment.type}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {sentiment.count} review{sentiment.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Right Side - Percentage & Trend */}
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {sentiment.percentage}%
                </div>
                {trend && (
                  <div className={`flex items-center gap-1 justify-end text-sm font-semibold ${
                    sentiment.trend >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{Math.abs(sentiment.trend)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sentiment.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                className={`h-full bg-gradient-to-r ${sentiment.gradient} relative`}
              >
                <motion.div
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
