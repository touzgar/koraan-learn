import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorCourseEditClient from '@/components/instructor/InstructorCourseEditClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditCoursePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorCourseEditClient />
}
