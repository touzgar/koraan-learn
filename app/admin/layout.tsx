import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const user = await requireAdmin()

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
        <main className="ml-72 p-6">
          {children}
        </main>
      </div>
    )
  } catch (error) {
    redirect('/sign-in')
  }
}
