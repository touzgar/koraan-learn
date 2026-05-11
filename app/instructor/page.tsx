import { redirect } from 'next/navigation'
import { requireInstructor, getCurrentUserWithRole } from '@/lib/user-roles'

export default async function InstructorDashboard() {
  try {
    await requireInstructor()
    const user = await getCurrentUserWithRole()

    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-blue-50/30 to-cream-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold mb-2">
              Espace Formateur - {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-blue-100">
              Gérez vos cours, leçons et étudiants
            </p>
          </div>
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-gray-600">
              Le tableau de bord formateur est en cours de développement...
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    redirect('/dashboard')
  }
}
