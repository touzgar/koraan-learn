'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Table, FileJson, X, Check } from 'lucide-react'
import { useState } from 'react'

interface ExportReviewsProps {
  reviews: any[]
  isOpen: boolean
  onClose: () => void
}

export default function ExportReviews({ reviews, isOpen, onClose }: ExportReviewsProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const formats = [
    {
      id: 'csv',
      name: 'CSV',
      icon: Table,
      description: 'Spreadsheet format for Excel',
      color: 'green'
    },
    {
      id: 'json',
      name: 'JSON',
      icon: FileJson,
      description: 'Structured data format',
      color: 'blue'
    },
    {
      id: 'pdf',
      name: 'PDF',
      icon: FileText,
      description: 'Printable document',
      color: 'red'
    }
  ]

  const handleExport = async () => {
    setExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate export based on format
    if (selectedFormat === 'csv') {
      exportToCSV()
    } else if (selectedFormat === 'json') {
      exportToJSON()
    } else {
      exportToPDF()
    }
    
    setExporting(false)
    setExported(true)
    
    setTimeout(() => {
      setExported(false)
      onClose()
    }, 2000)
  }

  const exportToCSV = () => {
    const headers = ['Student Name', 'Course', 'Rating', 'Comment', 'Date', 'Sentiment']
    const rows = reviews.map(r => [
      r.studentName,
      r.courseName,
      r.rating,
      `"${r.comment.replace(/"/g, '""')}"`,
      r.date,
      r.sentiment || 'neutral'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    downloadFile(csv, 'reviews.csv', 'text/csv')
  }

  const exportToJSON = () => {
    const json = JSON.stringify(reviews, null, 2)
    downloadFile(json, 'reviews.json', 'application/json')
  }

  const exportToPDF = () => {
    // In a real implementation, use a library like jsPDF
    console.log('PDF export would be implemented here')
    alert('PDF export functionality would be implemented with a library like jsPDF')
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Export Reviews</h2>
                    <p className="text-emerald-100 text-sm">
                      {reviews.length} reviews ready to export
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Select Export Format</h3>
              
              <div className="space-y-3 mb-6">
                {formats.map((format) => {
                  const Icon = format.icon
                  const isSelected = selectedFormat === format.id
                  
                  return (
                    <motion.button
                      key={format.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedFormat(format.id as any)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `border-${format.color}-500 bg-${format.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-${format.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${format.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{format.name}</h4>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`w-5 h-5 bg-${format.color}-500 rounded-full flex items-center justify-center`}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{format.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Export Options */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Export Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span className="text-sm text-gray-700">Include sentiment analysis</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span className="text-sm text-gray-700">Include tags</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-emerald-600" />
                    <span className="text-sm text-gray-700">Include replies</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting || exported}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {exporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Exporting...</span>
                    </>
                  ) : exported ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Exported!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Export</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
