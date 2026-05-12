/**
 * Reusable Review Card Component
 * Can be used across different parts of the application
 */

import { motion } from 'framer-motion'
import { 
  Star, Calendar, ThumbsUp, Eye, Heart, 
  MessageCircle, Award, Smile, Frown, Meh,
  MoreVertical, Flag
} from 'lucide-react'

interface ReviewCardProps {
  review: {
    id: string
    studentName: string
    courseName: string
    rating: number
    comment: string
    date: string
    sentiment?: 'positive' | 'neutral' | 'negative'
    tags?: string[]
    reactions?: {
      helpful: number
      insightful: number
      inspiring: number
    }
  }
  index?: number
  onReply?: (reviewId: string) => void
  onExpand?: (reviewId: string) => void
  compact?: boolean
}

export default function ReviewCard({ 
  review, 
  index = 0, 
  onReply, 
  onExpand,
  compact = false 
}: ReviewCardProps) {
  
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-4 h-4 text-green-500" />
      case 'negative':
        return <Frown className="w-4 h-4 text-red-500" />
      case 'neutral':
      default:
        return <Meh className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      <div className={compact ? 'p-4' : 'p-6'}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Avatar with Sentiment Badge */}
            <div className="relative">
              <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold ${compact ? 'text-base' : 'text-lg'} shadow-lg`}>
                {review.studentName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                {getSentimentIcon(review.sentiment)}
              </div>
            </div>

            {/* Student Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
                  {review.studentName}
                </h3>
                {review.rating >= 5 && (
                  <Award className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{review.courseName}</p>
              
              {/* Rating Stars */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {review.rating}.0
                </span>
              </div>
            </div>
          </div>

          {/* Date & Actions */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(review.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {!compact && review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {review.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment */}
        <p className={`text-gray-700 leading-relaxed mb-4 ${compact ? 'text-sm line-clamp-2' : 'text-base'}`}>
          {review.comment}
        </p>

        {/* Reactions Bar */}
        {!compact && (
          <div className="flex items-center gap-3 py-3 border-t border-b border-gray-100">
            <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all group">
              <ThumbsUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-blue-700">
                {review.reactions?.helpful || 0}
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all group">
              <Eye className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-purple-700">
                {review.reactions?.insightful || 0}
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-xl transition-all group">
              <Heart className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-pink-700">
                {review.reactions?.inspiring || 0}
              </span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3">
          {onReply && (
            <button
              onClick={() => onReply(review.id)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
          )}
          {onExpand && !compact && (
            <button
              onClick={() => onExpand(review.id)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium text-sm"
            >
              <span>View Details</span>
            </button>
          )}
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all ml-auto">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
