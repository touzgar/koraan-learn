'use client'

import { useEffect, useState } from 'react'
import { Award, Download, Share2, Eye, Calendar, CheckCircle, Loader2 } from 'lucide-react'

interface Certificate {
  id: string
  course: string
  instructor: string
  completedDate: string
  certificateUrl: string | null
  certificateNumber: string
}

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/student/certificates')
        if (response.ok) {
          const data = await response.json()
          setCertificates(data.certificates || [])
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          My Certificates
        </h1>
        <p className="text-gray-600 mt-1">Your achievements and completed courses</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 shadow-xl border-2 border-amber-200 relative overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200/30 rounded-full -ml-12 -mb-12" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <Award className="w-16 h-16 text-amber-600" />
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cert.course}</h3>
                <p className="text-gray-600 mb-4">Instructor: {cert.instructor}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-white/60 backdrop-blur-sm rounded-lg p-3">
                  <Calendar className="w-4 h-4" />
                  <span>Completed: {new Date(cert.completedDate).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all font-semibold shadow-lg">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="px-4 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">Certificate #{cert.certificateNumber}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <Award className="w-16 h-16 text-amber-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Certificates Yet</h3>
          <p className="text-gray-600">Complete courses to earn certificates</p>
        </div>
      )}
    </div>
  )
}
