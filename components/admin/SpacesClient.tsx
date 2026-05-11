'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  BookOpen,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Space {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  price: number
  status: string
  isPublished: boolean
  instructor: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  category: {
    id: string
    name: string
  } | null
  _count: {
    enrollments: number
    lessons: number
  }
}

interface Category {
  id: string
  name: string
}

interface Instructor {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
}

interface SpacesClientProps {
  spaces: Space[]
  categories: Category[]
  instructors: Instructor[]
}

export default function SpacesClient({ spaces, categories, instructors }: SpacesClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    instructorId: '',
    categoryId: '',
    status: 'DRAFT',
  })

  // Filter spaces
  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch = space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         space.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || space.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: spaces.length,
    published: spaces.filter(s => s.status === 'PUBLISHED').length,
    draft: spaces.filter(s => s.status === 'DRAFT').length,
    archived: spaces.filter(s => s.status === 'ARCHIVED').length,
  }

  const handleOpenModal = (space?: Space) => {
    if (space) {
      setEditingSpace(space)
      setFormData({
        title: space.title,
        description: space.description || '',
        price: space.price,
        instructorId: space.instructor.id,
        categoryId: space.category?.id || '',
        status: space.status,
      })
    } else {
      setEditingSpace(null)
      setFormData({
        title: '',
        description: '',
        price: 0,
        instructorId: '',
        categoryId: '',
        status: 'DRAFT',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSpace(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingSpace 
        ? `/api/admin/spaces/${editingSpace.id}`
        : '/api/admin/spaces'
      
      const method = editingSpace ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        handleCloseModal()
        router.refresh()
      } else {
        alert('Error saving space')
      }
    } catch (error) {
      alert('Error saving space')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/spaces/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error deleting space')
      }
    } catch (error) {
      alert('Error deleting space')
    } finally {
      setLoading(false)
      setDeleteConfirm(null)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/spaces/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error updating status')
      }
    } catch (error) {
      alert('Error updating status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700'
      case 'ARCHIVED':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spaces Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all learning spaces and courses</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30"
        >
          <Plus className="w-5 h-5" />
          Add New Space
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spaces</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-orange-600">{stats.archived}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-4 py-2.5 rounded-lg font-medium transition-colors',
                  statusFilter === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <motion.div
            key={space.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden group hover:shadow-xl transition-shadow"
          >
            {/* Image */}
            <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 relative">
              {space.imageUrl ? (
                <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(space.status))}>
                  {space.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{space.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{space.description || 'No description'}</p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{space._count.enrollments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{space._count.lessons} lessons</span>
                </div>
                <div className="font-semibold text-emerald-600">
                  {space.price}€
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700">
                    {space.instructor.firstName} {space.instructor.lastName}
                  </p>
                  <p>{space.category?.name || 'No category'}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={space.status}
                  onChange={(e) => handleStatusChange(space.id, e.target.value)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <button
                  onClick={() => handleOpenModal(space)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(space.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    deleteConfirm === space.id
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 hover:bg-red-50'
                  )}
                  title={deleteConfirm === space.id ? 'Click again to confirm' : 'Delete'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-emerald-100">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No spaces found</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSpace ? 'Edit Space' : 'Add New Space'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter space title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter space description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (€) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor *
                  </label>
                  <select
                    required
                    value={formData.instructorId}
                    onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.firstName} {instructor.lastName} ({instructor.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingSpace ? 'Update Space' : 'Create Space'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
