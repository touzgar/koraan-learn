'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Activity, Users, 
  Star, MessageSquare, Clock, Award, Target,
  BarChart2, PieChart, LineChart
} from 'lucide-react'

interface AnalyticsData {
  weeklyTrend: number
  monthlyTrend: number
  avgResponseTime: string
  topRatedCourse: string
  mostActiveMonth: string
  improvementAreas: string[]
  strengths: string[]
}

export default function ReviewAnalytics() {
  // Mock data - replace with real data from API
  const analytics: AnalyticsData = {
    weeklyTrend: 15,
    monthlyTrend: 8,
    avgResponseTime: '2.5 hours',
    topRatedCourse: 'Tajweed Basics',
    mostActiveMonth: 'January 2024',
    improvementAreas: ['Video Quality', 'Exercise Difficulty', 'Pacing'],
    strengths: ['Clear Explanations', 'Engaging Content', 'Practical Examples']
  }

  const metrics = [
    {
      label: 'Weekly Growth',
      value: `${analytics.weeklyTrend}%`,
      icon: TrendingUp,
      color: 'emerald',
      trend: 'up',
      description: 'More reviews this week'
    },
    {
      label: 'Monthly Trend',
      value: `${analytics.monthlyTrend}%`,
      icon: Activity,
      color: 'blue',
      trend: 'up',
      description: 'Compared to last month'
    },
    {
      label: 'Response Time',
      value: analytics.avgResponseTime,
      icon: Clock,
      color: 'purple',
      trend: 'neutral',
      description: 'Average reply time'
    },
    {
      label: 'Top Course',
      value: '4.9★',
      icon: Award,
      color: 'yellow',
      trend: 'neutral',
      description: analytics.topRatedCourse
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
                {metric.trend === 'up' && (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>Up</span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500">
                {metric.description}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Your Strengths</h3>
              <p className="text-sm text-gray-600">What students love</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {analytics.strengths.map((strength, index) => (
              <motion.div
                key={strength}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-700 font-medium">{strength}</span>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {(4.5 + Math.random() * 0.5).toFixed(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Improvement Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Growth Opportunities</h3>
              <p className="text-sm text-gray-600">Areas to enhance</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {analytics.improvementAreas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-700 font-medium">{area}</span>
                <div className="ml-auto">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {Math.floor(Math.random() * 5 + 3)} mentions
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Heatmap Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Review Activity</h3>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </div>
          </div>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View Full Report →
          </button>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const height = Math.random() * 80 + 20
            
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg relative group cursor-pointer hover:from-emerald-600 hover:to-teal-500 transition-all"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {Math.floor(height / 10)} reviews
                  </div>
                </motion.div>
                <span className="text-xs font-medium text-gray-600">{day}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
