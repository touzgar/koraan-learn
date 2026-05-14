'use client'

import { useEffect, useState } from 'react'
import { Award, Download, Share2, Calendar, CheckCircle, Loader2, Trophy, Star } from 'lucide-react'

interface Certificate {
  id: string
  course: string
  instructor: string
  completedDate: string
  certificateUrl: string | null
  certificateNumber: string
  description: string
  category: string
}

export default function StudentCertificatesClient() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [filter, setFilter] = useState<string>('all')

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

  const categories = ['all', ...Array.from(new Set(certificates.map(c => c.category)))]
  const filteredCerts = filter === 'all' 
    ? certificates 
    : certificates.filter(c => c.category === filter)

  const handleDownload = (cert: Certificate) => {
    alert(`Downloading certificate for ${cert.course}`)
  }

  const handleShare = (cert: Certificate) => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${cert.course}`,
        text: `I completed ${cert.course}!`,
        url: window.location.href,
      })
    } else {
      alert('Share functionality not supported')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">My Certificates</h1>
              <p className="text-amber-100 text-lg">Your learning achievements</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">{certificates.length}</p>
                  <p className="text-amber-100 text-sm">Total Certificates</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">{categories.length - 1}</p>
                  <p className="text-amber-100 text-sm">Categories</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-amber-100 text-sm">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Certificates' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Certificates Grid */}
      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCerts.map((cert, index) => (
            <div
              key={cert.id}
              className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-100 relative overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedCert(cert)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-100 to-amber-100 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-4 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                    {cert.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {cert.course}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">{cert.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {cert.instructor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium">{cert.instructor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                    <Calendar className="w-4 h-4" />
                    <span>Completed: {new Date(cert.completedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(cert)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(cert)
                    }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-4 font-mono">#{cert.certificateNumber}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center shadow-xl border-2 border-gray-100">
          <div className="bg-gradient-to-br from-amber-100 to-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Certificates Yet</h3>
          <p className="text-gray-600 mb-6">Complete courses to earn your first certificate</p>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg">
            Browse Courses
          </button>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>
            
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCert.course}</h2>
                <p className="text-gray-600">{selectedCert.description}</p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-semibold">{selectedCert.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{selectedCert.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold">
                    {new Date(selectedCert.completedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate ID:</span>
                  <span className="font-mono text-sm">{selectedCert.certificateNumber}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownload(selectedCert)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all font-semibold shadow-lg"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Certificate
                </button>
                <button 
                  onClick={() => handleShare(selectedCert)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
