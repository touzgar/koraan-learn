import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import StudentProfileClient from '@/components/student/StudentProfileClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'STUDENT') {
    redirect('/dashboard')
  }
  
  return <StudentProfileClient />
}