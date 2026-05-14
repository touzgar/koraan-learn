import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorCoursesClient from '@/components/instructor/InstructorCoursesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorCoursesClient />
}
