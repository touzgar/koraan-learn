import { prisma } from '@/lib/prisma'
import { BookOpen, Users, Clock, DollarSign, Eye, Edit, Trash2 } from 'lucide-react'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'PUBLISHED').length,
    draft: courses.filter(c => c.status === 'DRAFT').length,
    archived: courses.filter(c => c.status === 'ARCHIVED').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Cours</h1>
        <p className="text-slate-600 mt-1">Gérez tous les cours de la plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Cours</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Publiés</p>
              <p className="text-2xl font-bold text-slate-900">{stats.published}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Brouillons</p>
              <p className="text-2xl font-bold text-slate-900">{stats.draft}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Archivés</p>
              <p className="text-2xl font-bold text-slate-900">{stats.archived}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900">Tous les Cours</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Cours</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Instructeur</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Leçons</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Étudiants</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Prix</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 max-w-xs truncate">{course.title}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">{course.category?.name || '-'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">{course._count.lessons}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">{course._count.enrollments}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-emerald-600">
                      {course.price > 0 ? `${course.price}€` : 'Gratuit'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                      course.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {course.status === 'PUBLISHED' ? 'Publié' : course.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-emerald-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
