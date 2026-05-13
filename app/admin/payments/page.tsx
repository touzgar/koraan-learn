import { prisma } from '@/lib/prisma'
import { getCurrentUserWithRole } from '@/lib/user-roles'
import { CreditCard, TrendingUp, DollarSign, Users, Download, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PaymentsPage() {
  const user = await getCurrentUserWithRole()

  // Fetch enrollments (representing payments)
  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
      course: {
        select: {
          title: true,
          price: true,
          instructor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      enrolledAt: 'desc',
    },
    take: 50,
  })

  // Calculate stats
  const totalRevenue = enrollments.reduce((sum, e) => sum + e.course.price, 0)
  const totalTransactions = enrollments.length
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE').length

  // Group by month for chart
  const monthlyRevenue = enrollments.reduce((acc, e) => {
    const month = new Date(e.enrolledAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + e.course.price
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Paiements</h1>
          <p className="text-slate-600 mt-1">
            Suivez les revenus et les transactions de votre plateforme
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-300 hover:border-emerald-500 text-slate-700 font-semibold rounded-xl transition-all">
            <Filter className="w-5 h-5" />
            Filtrer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all">
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Revenus Total</p>
              <p className="text-2xl font-bold text-slate-900">{totalRevenue.toFixed(2)}€</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold">+12.5%</span>
            <span className="text-slate-600">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{totalTransactions}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-blue-600 font-semibold">+8.2%</span>
            <span className="text-slate-600">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Inscriptions Actives</p>
              <p className="text-2xl font-bold text-slate-900">{activeEnrollments}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-purple-600 font-semibold">+15.3%</span>
            <span className="text-slate-600">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Revenu Moyen</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}€
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-orange-600 font-semibold">+5.7%</span>
            <span className="text-slate-600">vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900">Transactions Récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Instructeur
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {enrollment.student.firstName?.[0] || 'U'}{enrollment.student.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {enrollment.student.firstName || 'Unknown'} {enrollment.student.lastName || ''}
                        </p>
                        <p className="text-xs text-slate-600">{enrollment.student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 max-w-xs truncate">
                      {enrollment.course.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">
                      {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-emerald-600">
                      {enrollment.course.price.toFixed(2)}€
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">
                      {new Date(enrollment.enrolledAt).toLocaleDateString('fr-FR')}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      enrollment.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : enrollment.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {enrollment.status === 'ACTIVE' ? 'Actif' : enrollment.status === 'COMPLETED' ? 'Terminé' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {enrollments.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Aucune transaction
            </h3>
            <p className="text-slate-600">
              Les transactions apparaîtront ici une fois que les étudiants commenceront à s'inscrire
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
