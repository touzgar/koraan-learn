import { prisma } from '@/lib/prisma'
import { Award, Download, Eye, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      issuedAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Certificats</h1>
        <p className="text-slate-600 mt-1">Gérez les certificats délivrés aux étudiants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Certificats</p>
              <p className="text-2xl font-bold text-slate-900">{certificates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Ce Mois</p>
              <p className="text-2xl font-bold text-slate-900">
                {certificates.filter(c => {
                  const date = new Date(c.issuedAt)
                  const now = new Date()
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Téléchargements</p>
              <p className="text-2xl font-bold text-slate-900">{certificates.length * 2}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900">Certificats Délivrés</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Étudiant</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Cours</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Numéro</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Date d'émission</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {(cert.student.firstName?.[0] || 'U')}{(cert.student.lastName?.[0] || '')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {cert.student.firstName || 'Unknown'} {cert.student.lastName || ''}
                        </p>
                        <p className="text-xs text-slate-600">{cert.student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 max-w-xs truncate">
                      {cert.course.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-mono text-slate-700">{cert.id}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-700">
                      {new Date(cert.issuedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {certificates.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun certificat</h3>
            <p className="text-slate-600">Les certificats apparaîtront ici une fois délivrés</p>
          </div>
        )}
      </div>
    </div>
  )
}
