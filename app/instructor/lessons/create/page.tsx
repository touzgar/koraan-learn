import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorLessonCreateClient from '@/components/instructor/InstructorLessonCreateClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CreateLessonPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorLessonCreateClient />
}
