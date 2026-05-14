'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Star, ThumbsUp, MessageCircle, Filter, 
  TrendingUp, Calendar, Download, Heart, Smile,
  Frown, Meh, BarChart3, Grid, List, Clock,
  Award, Target, Zap, Send, X, ChevronDown,
  Eye, Reply, MoreVertical, Flag
} from 'lucide-react'
import ExportReviews from '@/components/reviews/ExportReviews'

interface Review {
  id: string
  studentName: string
  courseName: string
  rating: number
  comment: string
  date: string
  helpful: number
  sentiment?: 'positive' | 'neutral' | 'negative'
  tags?: string[]
  replies?: Reply[]
  reactions?: {
    helpful: number
    insightful: number
    inspiring: number
  }
}

interface Reply {
  id: string
  author: string
  content: string
  date: string
}

interface ReviewsData {
  avgRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  reviews: Review[]
  trends?: {
    weeklyChange: number
    monthlyChange: number
  }
}

export default function InstructorReviewsPage() {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent')
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/instructor/reviews')
        if (response.ok) {
          const result = await response.json()
          // Enhance reviews with sentiment and tags
          const enhancedReviews = result.reviews.map((review: Review) => ({
            ...review,
            sentiment: analyzeSentiment(review.rating, review.comment),
            tags: extractTags(review.comment),
            reactions: {
              helpful: review.helpful || 0,
              insightful: Math.floor(Math.random() * 10),
              inspiring: Math.floor(Math.random() * 8)
            }
          }))
          setData({ ...result, reviews: enhancedReviews })
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Sentiment analysis helper
  const analyzeSentiment = (rating: number, comment: string): 'positive' | 'neutral' | 'negative' => {
    if (rating >= 4) return 'positive'
    if (rating === 3) return 'neutral'
    return 'negative'
  }

  // Extract tags from comment
  const extractTags = (comment: string): string[] => {
    const tags: string[] = []
    const lowerComment = comment.toLowerCase()
    
    if (lowerComment.includes('clear') || lowerComment.includes('understand')) tags.push('Clear')
    if (lowerComment.includes('helpful') || lowerComment.includes('useful')) tags.push('Helpful')
    if (lowerComment.includes('engaging') || lowerComment.includes('interesting')) tags.push('Engaging')
    if (lowerComment.includes('difficult') || lowerComment.includes('hard')) tags.push('Challenging')
    if (lowerComment.includes('excellent') || lowerComment.includes('amazing')) tags.push('Excellent')
    if (lowerComment.includes('practical') || lowerComment.includes('hands-on')) tags.push('Practical')
    
    return tags.slice(0, 3)
  }

  const handleReply = (reviewId: string) => {
    if (replyText.trim()) {
      // TODO: Implement reply API
      console.log('Reply to', reviewId, ':', replyText)
      setReplyText('')
      setReplyingTo(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load reviews data</p>
      </div>
    )
  }

  const filteredReviews = data.reviews.filter((review) => {
    const matchesSearch =
      review.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)
    const matchesSentiment = selectedSentiment === 'all' || review.sentiment === selectedSentiment
    return matchesSearch && matchesRating && matchesSentiment
  })

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'helpful':
        return (b.reactions?.helpful || 0) - (a.reactions?.helpful || 0)
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  // Get sentiment icon
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-5 h-5 text-green-500" />
      case 'negative':
        return <Frown className="w-5 h-5 text-red-500" />
      case 'neutral':
      default:
        return <Meh className="w-5 h-5 text-yellow-500" />
    }
  }

  // Get sentiment stats
  const sentimentStats = {
    positive: data.reviews.filter(r => r.sentiment === 'positive').length,
    neutral: data.reviews.filter(r => r.sentiment === 'neutral').length,
    negative: data.reviews.filter(r => r.sentiment === 'negative').length
  }

  // Calculate rating distribution percentages
  const totalRatings = Object.values(data.ratingDistribution).reduce((sum, count) => sum + count, 0)
  const getRatingPercentage = (count: number) => {
    return totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Student Reviews
          </h1>
          <p className="text-gray-600 mt-1">Analyze feedback and engage with your students</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'timeline' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Rating Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div className="text-4xl font-bold mb-1">{data.avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= data.avgRating ? 'fill-white' : 'opacity-30'
                  }`}
                />
              ))}
            </div>
            <p className="text-emerald-100 text-sm">Average Rating</p>
          </div>
        </motion.div>

        {/* Total Reviews Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{data.totalReviews}</div>
          <p className="text-gray-600 text-sm">Total Reviews</p>
        </motion.div>

        {/* Positive Sentiment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Smile className="w-8 h-8 text-green-500" />
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {Math.round((sentimentStats.positive / data.totalReviews) * 100)}%
          </div>
          <p className="text-gray-600 text-sm">Positive Feedback</p>
        </motion.div>

        {/* Response Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Reply className="w-8 h-8 text-purple-500" />
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">87%</div>
          <p className="text-gray-600 text-sm">Response Rate</p>
        </motion.div>
      </div>

      {/* Rating Distribution & Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Rating Distribution
            </h3>
          </div>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = data.ratingDistribution[rating as keyof typeof data.ratingDistribution]
              const percentage = getRatingPercentage(count)
              return (
                <motion.div
                  key={rating}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rating * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 h-3 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-16 text-right">
                    {count} ({percentage}%)
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Sentiment Analysis - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              Sentiment Analysis
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { type: 'positive', count: sentimentStats.positive, icon: Smile, color: 'green' },
              { type: 'neutral', count: sentimentStats.neutral, icon: Meh, color: 'yellow' },
              { type: 'negative', count: sentimentStats.negative, icon: Frown, color: 'red' }
            ].map((sentiment, idx) => {
              const Icon = sentiment.icon
              const percentage = Math.round((sentiment.count / data.totalReviews) * 100)
              
              return (
                <motion.div
                  key={sentiment.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-4 bg-${sentiment.color}-50 rounded-xl border border-${sentiment.color}-200 cursor-pointer transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 bg-${sentiment.color}-500 rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{sentiment.type}</p>
                      <p className="text-sm text-gray-600">{sentiment.count} reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold text-${sentiment.color}-600`}>
                      {percentage}%
                    </div>
                    <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                        className={`h-full bg-${sentiment.color}-500`}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews, students, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setSelectedSentiment('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSentiment === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedSentiment('positive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                selectedSentiment === 'positive'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smile className="w-4 h-4" />
              Positive
            </button>
            <button
              onClick={() => setSelectedSentiment('neutral')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                selectedSentiment === 'neutral'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Meh className="w-4 h-4" />
              Neutral
            </button>
            <button
              onClick={() => setSelectedSentiment('negative')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                selectedSentiment === 'negative'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Frown className="w-4 h-4" />
              Negative
            </button>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className={`
        ${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}
        ${viewMode === 'timeline' ? 'relative' : ''}
      `}>
        {viewMode === 'timeline' && (
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-blue-500" />
        )}
        
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300
                ${viewMode === 'timeline' ? 'ml-16 relative' : ''}
                ${expandedReview === review.id ? 'ring-2 ring-emerald-500' : ''}
              `}
            >
              {/* Timeline Dot */}
              {viewMode === 'timeline' && (
                <div className="absolute -left-[52px] top-8 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {review.studentName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        {getSentimentIcon(review.sentiment)}
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{review.studentName}</h3>
                        {review.rating >= 5 && (
                          <Award className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.courseName}</p>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.div
                              key={star}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: index * 0.05 + star * 0.05 }}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </motion.div>
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
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
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
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  {review.comment}
                </p>

                {/* Reactions Bar */}
                <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all group">
                    <ThumbsUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-blue-700">
                      {review.reactions?.helpful || 0}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all group">
                    <Eye className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-purple-700">
                      {review.reactions?.insightful || 0}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-xl transition-all group">
                    <Heart className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-pink-700">
                      {review.reactions?.inspiring || 0}
                    </span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  <button
                    onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedReview === review.id ? 'rotate-180' : ''}`} />
                    <span>{expandedReview === review.id ? 'Less' : 'More'}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium ml-auto">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Reply Box */}
                <AnimatePresence>
                  {replyingTo === review.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          I
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                            rows={3}
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleReply(review.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all font-medium shadow-lg"
                            >
                              <Send className="w-4 h-4" />
                              <span>Send Reply</span>
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText('')
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedReview === review.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">4.8</p>
                          <p className="text-xs text-gray-600">Course Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">12</p>
                          <p className="text-xs text-gray-600">Completed Lessons</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">85%</p>
                          <p className="text-xs text-gray-600">Progress</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterRating !== 'all' || selectedSentiment !== 'all'
                ? 'Try adjusting your filters to see more reviews'
                : 'Your students haven\'t left any reviews yet'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Export Modal */}
      <ExportReviews 
        reviews={sortedReviews}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  )
}

