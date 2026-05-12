'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, SlidersHorizontal, Calendar, Star } from 'lucide-react'
import { useState } from 'react'

interface ReviewFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterRating: string
  onRatingChange: (rating: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  dateRange?: { start: string; end: string }
  onDateRangeChange?: (range: { start: string; end: string }) => void
}

export default function ReviewFilters({
  searchQuery,
  onSearchChange,
  filterRating,
  onRatingChange,
  sortBy,
  onSortChange,
  dateRange,
  onDateRangeChange
}: ReviewFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const clearAllFilters = () => {
    onSearchChange('')
    onRatingChange('all')
    onSortChange('recent')
    if (onDateRangeChange) {
      onDateRangeChange({ start: '', end: '' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Main Filter Bar */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search reviews, students, courses..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3">
            {/* Rating Filter */}
            <div className="relative">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filterRating}
                onChange={(e) => onRatingChange(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="2">⭐⭐</option>
                <option value="1">⭐</option>
              </select>
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Advanced Filters Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-3 rounded-xl border-2 transition-all ${
                showAdvanced
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </motion.button>

            {/* Clear Filters */}
            {(searchQuery || filterRating !== 'all' || sortBy !== 'recent') && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-all font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                Advanced Filters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range */}
                {onDateRangeChange && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateRange?.start || ''}
                        onChange={(e) => onDateRangeChange({ ...dateRange!, start: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                      />
                      <input
                        type="date"
                        value={dateRange?.end || ''}
                        onChange={(e) => onDateRangeChange({ ...dateRange!, end: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Course Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Course
                  </label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm">
                    <option value="all">All Courses</option>
                    <option value="tajweed">Tajweed Basics</option>
                    <option value="arabic">Arabic Grammar</option>
                    <option value="quran">Quran Memorization</option>
                  </select>
                </div>

                {/* Response Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Response Status
                  </label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm">
                    <option value="all">All Reviews</option>
                    <option value="replied">Replied</option>
                    <option value="pending">Pending Reply</option>
                  </select>
                </div>
              </div>

              {/* Quick Filter Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Quick filters:</span>
                {['Excellent', 'Helpful', 'Engaging', 'Challenging', 'Practical'].map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Count */}
      {(searchQuery || filterRating !== 'all' || sortBy !== 'recent') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-3 bg-emerald-50 border-t border-emerald-100"
        >
          <p className="text-sm text-emerald-700 font-medium">
            {[searchQuery, filterRating !== 'all', sortBy !== 'recent'].filter(Boolean).length} filter(s) active
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
