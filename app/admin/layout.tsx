import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const user = await getCurrentUser()
    
    // Redirect if not authenticated
    if (!user) {
      redirect('/sign-in')
    }
    
    // Redirect if not admin
    if (user.role !== 'ADMIN') {
      redirect('/dashboard')
    }

    // Fetch dynamic counts for sidebar badges
    const [pendingNotifications, totalSpaces, todayReservations] = await Promise.all([
      prisma.notification.count({ where: { isRead: false } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count({ 
        where: { 
          enrolledAt: { 
            gte: new Date(new Date().setHours(0, 0, 0, 0)) 
          } 
        } 
      }),
    ])

    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-emerald-50/30 to-cream-50">
        <AdminSidebar 
          user={user} 
          pendingNotifications={pendingNotifications}
          totalSpaces={totalSpaces}
          todayReservations={todayReservations}
        />
        <div className="lg:ml-72">
          <AdminHeader user={user} />
          <main className="p-4 sm:p-6 lg:p-8 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    )
  } catch (error) {
    redirect('/sign-in')
  }
}
