import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import NotificationsClient from '@/components/admin/NotificationsClient'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  
  // Fetch notifications from database
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Calculate stats
  const stats = {
    total: notifications.length,
    newUsers: notifications.filter(n => n.type === 'NEW_USER').length,
    newCourses: notifications.filter(n => n.type === 'NEW_COURSE').length,
    newEnrollments: notifications.filter(n => n.type === 'NEW_ENROLLMENT').length,
    completedEnrollments: notifications.filter(n => n.type === 'COMPLETED_ENROLLMENT').length,
    cancelledEnrollments: notifications.filter(n => n.type === 'CANCELLED_ENROLLMENT').length,
    inactiveUsers: notifications.filter(n => n.type === 'INACTIVE_USER').length,
    draftCourses: notifications.filter(n => n.type === 'DRAFT_COURSE').length,
    unread: notifications.filter(n => !n.isRead).length,
  }

  return <NotificationsClient notifications={notifications} stats={stats} />
}
