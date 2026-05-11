'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserRole } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Shield,
  GraduationCap,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  BookOpen,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserData {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  role: UserRole
  imageUrl: string | null
  isActive: boolean
  createdAt: Date
  _count: {
    coursesCreated: number
    enrollments: number
    certificates: number
  }
}

interface UsersTableProps {
  users: UserData[]
}

const roleConfig = {
  ADMIN: {
    label: 'Admin',
    icon: Shield,
    color: 'text-purple-700 bg-purple-100',
  },
  INSTRUCTOR: {
    label: 'Formateur',
    icon: GraduationCap,
    color: 'text-blue-700 bg-blue-100',
  },
  STUDENT: {
    label: 'Étudiant',
    icon: User,
    color: 'text-emerald-700 bg-emerald-100',
  },
}

export default function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-emerald-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Statistiques
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {users.map((user, index) => {
              const config = roleConfig[user.role]
              const RoleIcon = config.icon

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-emerald-50/50 transition-colors"
                >
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-2 border-transparent hover:border-emerald-300 transition-all',
                        config.color
                      )}
                    >
                      <option value="STUDENT">Étudiant</option>
                      <option value="INSTRUCTOR">Formateur</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                        user.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      )}
                    >
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>

                  {/* Statistics */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      {user.role === 'INSTRUCTOR' && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {user._count.coursesCreated}
                        </div>
                      )}
                      {user.role === 'STUDENT' && (
                        <>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {user._count.enrollments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {user._count.certificates}
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-emerald-100 bg-emerald-50/30">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de <span className="font-semibold">{users.length}</span> utilisateurs
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
              Précédent
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:shadow-lg transition-all">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
