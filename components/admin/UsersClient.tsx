'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  UserPlus,
  Edit,
  Trash2,
  Eye,
  X,
  Mail,
  Shield,
  GraduationCap,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Chrome,
  Key,
  Download,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface User {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  role: string
  isActive: boolean
  createdAt: Date
  _count: {
    coursesCreated: number
    enrollments: number
    certificates: number
  }
}

interface UsersClientProps {
  users: User[]
}

export default function UsersClient({ users }: UsersClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [statusChangingUser, setStatusChangingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  })

  // Determine login type based on clerkId pattern
  const getLoginType = (clerkId: string) => {
    // Clerk OAuth providers have specific prefixes
    if (clerkId.includes('oauth_google')) return 'google'
    if (clerkId.includes('oauth_')) return 'oauth'
    // Email/password users typically have user_ prefix
    return 'email'
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.isActive) ||
      (statusFilter === 'INACTIVE' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Calculate statistics
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    instructors: users.filter(u => u.role === 'INSTRUCTOR').length,
    students: users.filter(u => u.role === 'STUDENT').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    emailLogins: users.filter(u => getLoginType(u.clerkId) === 'email').length,
    googleLogins: users.filter(u => getLoginType(u.clerkId) === 'google').length,
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error updating role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Error updating role')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!statusChangingUser) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${statusChangingUser.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        setStatusChangingUser(null)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error updating status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      role: user.role,
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        setEditingUser(null)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error updating user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingUser) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeletingUser(null)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error deleting user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Login Type', 'Status', 'Courses', 'Enrollments', 'Certificates', 'Created'],
      ...filteredUsers.map(u => [
        `${u.firstName} ${u.lastName}`,
        u.email,
        u.role,
        getLoginType(u.clerkId),
        u.isActive ? 'Active' : 'Inactive',
        u._count.coursesCreated,
        u._count.enrollments,
        u._count.certificates,
        format(new Date(u.createdAt), 'yyyy-MM-dd'),
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />
      case 'INSTRUCTOR':
        return <GraduationCap className="w-4 h-4" />
      case 'STUDENT':
        return <UserIcon className="w-4 h-4" />
      default:
        return <UserIcon className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'STUDENT':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLoginIcon = (type: string) => {
    switch (type) {
      case 'google':
        return <Chrome className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      default:
        return <Key className="w-4 h-4" />
    }
  }

  const getLoginColor = (type: string) => {
    switch (type) {
      case 'google':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'email':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all platform users and their roles</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
          <p className="text-xs text-gray-600 mb-1">Admins</p>
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
          <p className="text-xs text-gray-600 mb-1">Instructors</p>
          <p className="text-2xl font-bold text-blue-600">{stats.instructors}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
          <p className="text-xs text-gray-600 mb-1">Students</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.students}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
          <p className="text-xs text-gray-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-red-100">
          <p className="text-xs text-gray-600 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
          <p className="text-xs text-gray-600 mb-1">Email</p>
          <p className="text-2xl font-bold text-blue-600">{stats.emailLogins}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-red-100">
          <p className="text-xs text-gray-600 mb-1">Google</p>
          <p className="text-2xl font-bold text-red-600">{stats.googleLogins}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleFilterChange()
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="STUDENT">Student</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Login Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => {
                const loginType = getLoginType(user.clerkId)
                
                return (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-emerald-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={loading}
                        className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center gap-1',
                          getRoleColor(user.role)
                        )}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="STUDENT">Student</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border',
                        getLoginColor(loginType)
                      )}>
                        {getLoginIcon(loginType)}
                        {loginType === 'google' ? 'Google' : loginType === 'email' ? 'Email' : 'OAuth'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border',
                        user.isActive
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      )}>
                        {user.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setStatusChangingUser(user)}
                          disabled={loading}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            user.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          )}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                          page === currentPage
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  {selectedUser.imageUrl ? (
                    <img
                      src={selectedUser.imageUrl}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('px-3 py-1 text-xs font-semibold rounded-full border', getRoleColor(selectedUser.role))}>
                        {selectedUser.role}
                      </span>
                      <span className={cn('px-3 py-1 text-xs font-semibold rounded-full border', getLoginColor(getLoginType(selectedUser.clerkId)))}>
                        {getLoginType(selectedUser.clerkId) === 'google' ? 'Google Login' : 'Email Login'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedUser._count.coursesCreated}</p>
                    <p className="text-sm text-gray-600">Courses Created</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{selectedUser._count.enrollments}</p>
                    <p className="text-sm text-gray-600">Enrollments</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedUser._count.certificates}</p>
                    <p className="text-sm text-gray-600">Certificates</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={cn('text-sm font-semibold', selectedUser.isActive ? 'text-green-600' : 'text-red-600')}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Joined:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {format(new Date(selectedUser.createdAt), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clerk ID:</span>
                    <span className="text-xs font-mono text-gray-500">{selectedUser.clerkId}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Innovative Delete Popup */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Red Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete User</h3>
                    <p className="text-red-100 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    You are about to permanently delete:
                  </p>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    {deletingUser.imageUrl ? (
                      <img
                        src={deletingUser.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">
                        {deletingUser.firstName?.[0]}{deletingUser.lastName?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">
                        {deletingUser.firstName} {deletingUser.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{deletingUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 font-medium">
                    ⚠️ This will also delete:
                  </p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1 ml-4">
                    <li>• {deletingUser._count.coursesCreated} courses created</li>
                    <li>• {deletingUser._count.enrollments} enrollments</li>
                    <li>• {deletingUser._count.certificates} certificates</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setDeletingUser(null)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Innovative Status Change Popup */}
      <AnimatePresence>
        {statusChangingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header - Green for Activate, Orange for Deactivate */}
              <div className={cn(
                'p-6',
                statusChangingUser.isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {statusChangingUser.isActive ? (
                      <XCircle className="w-8 h-8 text-white" />
                    ) : (
                      <CheckCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {statusChangingUser.isActive ? 'Deactivate User' : 'Activate User'}
                    </h3>
                    <p className={cn(
                      'text-sm',
                      statusChangingUser.isActive ? 'text-orange-100' : 'text-green-100'
                    )}>
                      {statusChangingUser.isActive 
                        ? 'User will lose access to the platform' 
                        : 'User will regain access to the platform'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className={cn(
                  'border-2 rounded-xl p-4',
                  statusChangingUser.isActive
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-green-50 border-green-200'
                )}>
                  <p className="text-sm text-gray-700 mb-3">
                    {statusChangingUser.isActive 
                      ? 'You are about to deactivate:' 
                      : 'You are about to activate:'}
                  </p>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    {statusChangingUser.imageUrl ? (
                      <img
                        src={statusChangingUser.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                        statusChangingUser.isActive
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      )}>
                        {statusChangingUser.firstName?.[0]}{statusChangingUser.lastName?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">
                        {statusChangingUser.firstName} {statusChangingUser.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{statusChangingUser.email}</p>
                      <span className={cn(
                        'inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full',
                        getRoleColor(statusChangingUser.role)
                      )}>
                        {statusChangingUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {statusChangingUser.isActive ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 font-medium">
                      ⚠️ When deactivated:
                    </p>
                    <ul className="text-xs text-yellow-700 mt-2 space-y-1 ml-4">
                      <li>• User cannot log in</li>
                      <li>• Existing sessions will be terminated</li>
                      <li>• Data will be preserved</li>
                      <li>• Can be reactivated anytime</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 font-medium">
                      ℹ️ When activated:
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                      <li>• User can log in again</li>
                      <li>• Full access restored</li>
                      <li>• All data intact</li>
                      <li>• Notifications will be sent</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setStatusChangingUser(null)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={loading}
                  className={cn(
                    'flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50',
                    statusChangingUser.isActive
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30'
                  )}
                >
                  {loading ? 'Processing...' : statusChangingUser.isActive ? 'Yes, Deactivate' : 'Yes, Activate'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
