'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Award,
  Download,
  Eye,
  Calendar,
  Loader2,
  TrendingUp,
  Users,
  Filter,
  X,
  CheckCircle,
  FileText,
  Printer,
  Mail,
  Share2,
} from 'lucide-react'

interface Certificate {
  id: string
  studentName: string
  studentEmail: string
  courseName: string
  issueDate: string
  certificateId: string
  status: string
}

export default function InstructorCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month' | 'year'>('all')

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/instructor/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates)
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (filterPeriod === 'all') return true

    const issueDate = new Date(cert.issueDate)
    const now = new Date()

    if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return issueDate >= weekAgo
    }

    if (filterPeriod === 'month') {
      return (
        issueDate.getMonth() === now.getMonth() &&
        issueDate.getFullYear() === now.getFullYear()
      )
    }

    if (filterPeriod === 'year') {
      return issueDate.getFullYear() === now.getFullYear()
    }

    return true
  })

  // Calculate stats
  const now = new Date()
  const thisMonth = certificates.filter((cert) => {
    const issueDate = new Date(cert.issueDate)
    return (
      issueDate.getMonth() === now.getMonth() &&
      issueDate.getFullYear() === now.getFullYear()
    )
  }).length

  const thisWeek = certificates.filter((cert) => {
    const issueDate = new Date(cert.issueDate)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return issueDate >= weekAgo
  }).length

  const uniqueStudents = new Set(certificates.map((c) => c.studentEmail)).size
  const uniqueCourses = new Set(certificates.map((c) => c.courseName)).size

  const viewCertificate = (cert: Certificate) => {
    setSelectedCert(cert)
    setShowDetailsModal(true)
  }

  const downloadCertificate = (cert: Certificate) => {
    // Generate a simple certificate HTML and download as PDF-ready HTML
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.studentName}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .certificate {
            background: white;
            padding: 60px;
            max-width: 800px;
            text-align: center;
            border: 20px solid #10b981;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .certificate h1 {
            font-size: 48px;
            color: #10b981;
            margin-bottom: 20px;
          }
          .certificate h2 {
            font-size: 32px;
            color: #1f2937;
            margin: 30px 0;
          }
          .certificate p {
            font-size: 18px;
            color: #6b7280;
            line-height: 1.8;
          }
          .student-name {
            font-size: 36px;
            color: #10b981;
            font-weight: bold;
            margin: 20px 0;
            text-decoration: underline;
          }
          .course-name {
            font-size: 24px;
            color: #1f2937;
            font-weight: bold;
            margin: 20px 0;
          }
          .cert-id {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 40px;
            font-family: monospace;
          }
          .date {
            font-size: 16px;
            color: #6b7280;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>🏆 CERTIFICATE OF COMPLETION 🏆</h1>
          <p>This is to certify that</p>
          <div class="student-name">${cert.studentName}</div>
          <p>has successfully completed the course</p>
          <div class="course-name">${cert.courseName}</div>
          <p>and has demonstrated proficiency in the subject matter</p>
          <div class="date">Issued on: ${new Date(cert.issueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
          <div class="cert-id">Certificate ID: ${cert.certificateId}</div>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([certificateHTML], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificate-${cert.studentName.replace(/\s+/g, '-')}-${cert.certificateId.substring(0, 8)}.html`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const printCertificate = (cert: Certificate) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${cert.studentName}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
            body {
              font-family: 'Georgia', serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .certificate {
              background: white;
              padding: 60px;
              max-width: 800px;
              text-align: center;
              border: 20px solid #10b981;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .certificate h1 {
              font-size: 48px;
              color: #10b981;
              margin-bottom: 20px;
            }
            .certificate h2 {
              font-size: 32px;
              color: #1f2937;
              margin: 30px 0;
            }
            .certificate p {
              font-size: 18px;
              color: #6b7280;
              line-height: 1.8;
            }
            .student-name {
              font-size: 36px;
              color: #10b981;
              font-weight: bold;
              margin: 20px 0;
              text-decoration: underline;
            }
            .course-name {
              font-size: 24px;
              color: #1f2937;
              font-weight: bold;
              margin: 20px 0;
            }
            .cert-id {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 40px;
              font-family: monospace;
            }
            .date {
              font-size: 16px;
              color: #6b7280;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>🏆 CERTIFICATE OF COMPLETION 🏆</h1>
            <p>This is to certify that</p>
            <div class="student-name">${cert.studentName}</div>
            <p>has successfully completed the course</p>
            <div class="course-name">${cert.courseName}</div>
            <p>and has demonstrated proficiency in the subject matter</p>
            <div class="date">Issued on: ${new Date(cert.issueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
            <div class="cert-id">Certificate ID: ${cert.certificateId}</div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600 mt-1">Track and manage issued certificates</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const csv = [
              ['Certificate ID', 'Student', 'Email', 'Course', 'Issue Date', 'Status'],
              ...certificates.map((c) => [
                c.certificateId,
                c.studentName,
                c.studentEmail,
                c.courseName,
                c.issueDate,
                c.status,
              ]),
            ]
              .map((row) => row.join(','))
              .join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `certificates-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-semibold mb-1">Total Issued</p>
              <p className="text-3xl font-bold text-emerald-900">{certificates.length}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-emerald-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-1">This Month</p>
              <p className="text-3xl font-bold text-blue-900">{thisMonth}</p>
            </div>
            <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold mb-1">This Week</p>
              <p className="text-3xl font-bold text-purple-900">{thisWeek}</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-purple-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-semibold mb-1">Unique Students</p>
              <p className="text-3xl font-bold text-orange-900">{uniqueStudents}</p>
            </div>
            <div className="w-14 h-14 bg-orange-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-orange-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, course, or certificate ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterPeriod === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPeriod('week')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterPeriod === 'week'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setFilterPeriod('month')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterPeriod === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setFilterPeriod('year')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterPeriod === 'year'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {cert.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                {cert.studentName}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{cert.studentEmail}</p>
              <p className="text-sm font-semibold text-emerald-600 mb-4 line-clamp-1">
                {cert.courseName}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                <Calendar className="w-4 h-4" />
                <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => viewCertificate(cert)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => printCertificate(cert)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
                  title="Print Certificate"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => downloadCertificate(cert)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
                  title="Download Certificate"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery || filterPeriod !== 'all' ? 'No certificates found' : 'No certificates issued yet'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || filterPeriod !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Certificates will appear here when students complete your courses'}
          </p>
        </motion.div>
      )}

      {/* Certificate Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Certificate Details</h3>
                    <p className="text-gray-600">View certificate information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {selectedCert.certificateId}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Student Name</p>
                    <p className="font-semibold text-gray-900">{selectedCert.studentName}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-sm text-emerald-600 font-semibold mb-1">Course</p>
                    <p className="font-semibold text-gray-900">{selectedCert.courseName}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{selectedCert.studentEmail}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-sm text-orange-600 font-semibold mb-1">Issue Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedCert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600 font-semibold mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-gray-900">{selectedCert.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => downloadCertificate(selectedCert)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={() => printCertificate(selectedCert)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Printer className="w-5 h-5" />
                    Print
                  </button>
                </div>
                <a
                  href={`mailto:${selectedCert.studentEmail}?subject=Your Certificate for ${selectedCert.courseName}&body=Congratulations! Your certificate is attached.`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email Student
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
