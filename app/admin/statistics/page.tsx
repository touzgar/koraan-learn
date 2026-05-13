import { prisma } from '@/lib/prisma'
import { TrendingUp, Users, BookOpen, DollarSign, Award, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StatisticsPage() {
  const [users, courses, enrollments, certificates] = await Promise.all([
    prisma.user.findMany({ select: { createdAt: true, role: true } }),
    prisma.course.findMany({ select: { createdAt: true, status: true, price: true } }),
    prisma.enrollment.findMany({ select: { enrolledAt: true, status: true, course: { select: { price: true } } } }),
    prisma.certificate.findMany({ select: { issuedAt: true } }),
  ])

  // Calculate monthly data
  const getLast6Months = () => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        name: date.toLocaleDateString('fr-FR', { month: 'short' }),
        fullDate: date,
      })
    }
    return months
  }

  const months = getLast6Months()
  const monthlyData = months.map(month => {
    const monthUsers = users.filter(u => {
      const d = new Date(u.createdAt)
      return d.getMonth() === month.fullDate.getMonth() && d.getFullYear() === month.fullDate.getFullYear()
    }).length

    const monthEnrollments = enrollments.filter(e => {
      const d = new Date(e.enrolledAt)
      return d.getMonth() === month.fullDate.getMonth() && d.getFullYear() === month.fullDate.getFullYear()
    })

    const monthRevenue = monthEnrollments.reduce((sum, e) => sum + e.course.price, 0)

    return {
      month: month.name,
      users: monthUsers,
      enrollments: monthEnrollments.length,
      revenue: monthRevenue,
    }
  })

  const totalRevenue = enrollments.reduce((sum, e) => sum + e.course.price, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Statistiques Détaillées</h1>
        <p className="text-slate-600 mt-1">Analysez les performances de votre plateforme</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{users.length}</p>
          <p className="text-blue-100 text-sm">Utilisateurs</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 opacity-80" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{courses.length}</p>
          <p className="text-emerald-100 text-sm">Cours</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{enrollments.length}</p>
          <p className="text-purple-100 text-sm">Inscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{totalRevenue.toFixed(0)}€</p>
          <p className="text-orange-100 text-sm">Revenus</p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Nouveaux Utilisateurs (6 mois)</h3>
          <div className="space-y-4">
            {monthlyData.map((data, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{data.month}</span>
                  <span className="text-sm font-bold text-blue-600">{data.users}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(data.users / Math.max(...monthlyData.map(d => d.users))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollments Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Inscriptions (6 mois)</h3>
          <div className="space-y-4">
            {monthlyData.map((data, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{data.month}</span>
                  <span className="text-sm font-bold text-emerald-600">{data.enrollments}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${(data.enrollments / Math.max(...monthlyData.map(d => d.enrollments))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenus Mensuels (6 mois)</h3>
        <div className="space-y-4">
          {monthlyData.map((data, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{data.month}</span>
                <span className="text-sm font-bold text-orange-600">{data.revenue.toFixed(2)}€</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all"
                  style={{ width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Distribution des Rôles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['STUDENT', 'INSTRUCTOR', 'ADMIN'].map(role => {
            const count = users.filter(u => u.role === role).length
            const percentage = ((count / users.length) * 100).toFixed(1)
            return (
              <div key={role} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke={role === 'STUDENT' ? '#10b981' : role === 'INSTRUCTOR' ? '#3b82f6' : '#f59e0b'}
                      strokeWidth="12"
                      strokeDasharray={`${(count / users.length) * 351.86} 351.86`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{percentage}%</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">{role}</p>
                <p className="text-xs text-slate-600">{count} utilisateurs</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
