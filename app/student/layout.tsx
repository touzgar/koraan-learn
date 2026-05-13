import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import StudentLayoutClient from '@/components/student/StudentLayoutClient'

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
      <StudentLayoutClient user={user}>
        {children}
      </StudentLayoutClient>
    )
  } catch (error) {
    redirect('/sign-in')
  }
}
