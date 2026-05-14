import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import InstructorQuizEditClient from '@/components/instructor/InstructorQuizEditClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditQuizPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <InstructorQuizEditClient />
}
