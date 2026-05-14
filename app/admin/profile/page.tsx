import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AdminProfileClient from '@/components/admin/AdminProfileClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  return <AdminProfileClient />
}
