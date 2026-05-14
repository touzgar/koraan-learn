import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorProfileClient from '@/components/instructor/InstructorProfileClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InstructorProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorProfileClient />
}
