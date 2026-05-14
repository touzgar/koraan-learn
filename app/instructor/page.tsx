import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorDashboardClient from '@/components/instructor/InstructorDashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InstructorDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorDashboardClient />
}
