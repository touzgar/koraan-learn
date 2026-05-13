import { prisma } from '@/lib/prisma'
import { getCurrentUserWithRole } from '@/lib/user-roles'
import { CheckCircle, XCircle, Clock, Eye, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ValidationPage() {
  const user = await getCurrentUserWithRole()

  // Fetch courses pending validation
  const pendingCourses = await prisma.course.findMany({
    where: {
      status: 'DRAFT',
    },
    include: {
      instructor: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
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

  const publishedCourses = await prisma.course.count({
    where: { status: 'PUBLISHED' },
  })

  const rejectedCourses = await prisma.course.count({
    where: { status: 'DRAFT' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Validation des Cours</h1>
        <p className="text-slate-600 mt-1">
          Validez ou rejetez les cours soumis par les instructeurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">En Attente</p>
              <p className="text-2xl font-bold text-slate-900">{pendingCourses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Validés</p>
              <p className="text-2xl font-bold text-slate-900">{publishedCourses}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Rejetés</p>
              <p className="text-2xl font-bold text-slate-900">{rejectedCourses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Courses */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900">Cours en Attente de Validation</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {pendingCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-6">
                {/* Course Image */}
                <div className="w-32 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-emerald-600" />
                  )}
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex-shrink-0 ml-4">
                      En attente
                    </span>
                  </div>

                  {/* Instructor Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {course.instructor.firstName?.[0] || 'U'}{course.instructor.lastName?.[0] || ''}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {course.instructor.firstName || 'Unknown'} {course.instructor.lastName || ''}
                      </p>
                      <p className="text-xs text-slate-600">{course.instructor.email}</p>
                    </div>
                  </div>

                  {/* Course Meta */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{course._count.lessons} leçons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-semibold">{course.category?.name || 'Sans catégorie'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{course.price > 0 ? `${course.price}€` : 'Gratuit'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                      <Eye className="w-4 h-4" />
                      Voir le cours
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Valider
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
                      <XCircle className="w-4 h-4" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pendingCourses.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Aucun cours en attente
            </h3>
            <p className="text-slate-600">
              Tous les cours ont été validés ou rejetés
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
