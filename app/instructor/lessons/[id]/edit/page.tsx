import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorLessonEditClient from '@/components/instructor/InstructorLessonEditClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditLessonPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorLessonEditClient />
}
