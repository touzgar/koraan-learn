import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import CalendarClient from '@/components/admin/CalendarClient'

export default async function CalendarPage() {
  const user = await getCurrentUser()
  
  // Fetch all enrollments for calendar
  const enrollments = await prisma.enrollment.findMany({
    include: {
      course: {
        select: {
          title: true,
          instructor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  })

  // Fetch users created dates
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch courses created dates
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      instructor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return <CalendarClient enrollments={enrollments} users={users} courses={courses} />
}
