import { prisma } from '@/lib/prisma'
import { getCurrentUserWithRole } from '@/lib/user-roles'
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CategoriesPage() {
  const user = await getCurrentUserWithRole()

  // Fetch all categories with course count
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          courses: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Catégories</h1>
          <p className="text-slate-600 mt-1">
            Gérez les catégories de cours de votre plateforme
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
          <Plus className="w-5 h-5" />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Catégories</p>
              <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Catégories Actives</p>
              <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Cours</p>
              <p className="text-2xl font-bold text-slate-900">
                {categories.reduce((sum, cat) => sum + cat._count.courses, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:scale-105 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderTree className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                {category._count.courses} cours
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderTree className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Aucune catégorie
          </h3>
          <p className="text-slate-600 mb-6">
            Commencez par créer votre première catégorie de cours
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
            <Plus className="w-5 h-5" />
            Créer une catégorie
          </button>
        </div>
      )}
    </div>
  )
}
