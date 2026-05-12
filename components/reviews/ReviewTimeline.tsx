'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Clock, Award, TrendingUp } from 'lucide-react'

interface Review {
  id: string
  studentName: string
  courseName: string
  rating: number
  comment: string
  date: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

interface ReviewTimelineProps {
  reviews: Review[]
}

export default function ReviewTimeline({ reviews }: ReviewTimelineProps) {
  // Group reviews by month
  const groupedReviews = reviews.reduce((acc, review) => {
    const date = new Date(review.date)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(review)
    return acc
  }, {} as Record<string, Review[]>)

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'from-green-500 to-emerald-600'
      case 'negative':
        return 'from-red-500 to-rose-600'
      case 'neutral':
      default:
        return 'from-yellow-500 to-amber-600'
    }
  }

  const getMonthStats = (reviews: Review[]) => {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    const positiveCount = reviews.filter(r => r.sentiment === 'positive').length
    return { avgRating, positiveCount, total: reviews.length }
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-blue-500 rounded-full" />

      <div className="space-y-12">
        {Object.entries(groupedReviews).map(([monthYear, monthReviews], monthIndex) => {
          const stats = getMonthStats(monthReviews)
          
          return (
            <motion.div
              key={monthYear}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: monthIndex * 0.1 }}
              className="relative"
            >
              {/* Month Header */}
              <div className="flex items-center gap-4 mb-6 ml-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: monthIndex * 0.1 + 0.2 }}
                  className="absolute -left-[52px] w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 text-white" />
                </motion.div>

                <div className="flex-1 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{monthYear}</h3>
                      <p className="text-sm text-gray-600">{stats.total} reviews this month</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {stats.avgRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Avg Rating</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-lg font-bold text-gray-900">
                            {Math.round((stats.positiveCount / stats.total) * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Positive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews for this month */}
              <div className="ml-20 space-y-4">
                {monthReviews.map((review, reviewIndex) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: monthIndex * 0.1 + reviewIndex * 0.05 }}
                    className="relative"
                  >
                    {/* Review Dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: monthIndex * 0.1 + reviewIndex * 0.05 + 0.1 }}
                      className={`absolute -left-[46px] w-6 h-6 bg-gradient-to-br ${getSentimentColor(review.sentiment)} rounded-full border-3 border-white shadow-lg`}
                    />

                    {/* Review Card */}
                    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {review.studentName.charAt(0)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.studentName}
                              </h4>
                              {review.rating === 5 && (
                                <Award className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{review.courseName}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(review.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                        {review.comment}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* End Marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: Object.keys(groupedReviews).length * 0.1 }}
        className="relative ml-20 mt-8"
      >
        <div className="absolute -left-[52px] w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <p className="text-center text-gray-700 font-medium">
            🎉 You've reached the beginning of your review journey!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
