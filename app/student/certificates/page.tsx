import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import StudentCertificatesClient from '@/components/student/StudentCertificatesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentCertificatesPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'STUDENT') {
    redirect('/dashboard')
  }
  
  return <StudentCertificatesClient />
}
