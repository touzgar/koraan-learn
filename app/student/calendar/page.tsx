import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import StudentCalendarClient from '@/components/student/StudentCalendarClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentCalendarPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'STUDENT') {
    redirect('/dashboard')
  }
  
  return <StudentCalendarClient />
}
