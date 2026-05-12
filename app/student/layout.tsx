import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import StudentSidebar from '@/components/student/StudentSidebar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      redirect('/sign-in')
    }

    if (user.role !== 'STUDENT') {
      redirect('/dashboard')
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-emerald-50/30 to-cream-50">
        <StudentSidebar user={user} />
        <main className="ml-72 p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    )
  } catch (error) {
    redirect('/sign-in')
  }
}
