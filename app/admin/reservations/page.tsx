import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import ReservationsClient from '@/components/admin/ReservationsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ReservationsPage() {
  const user = await getCurrentUser()
  
  const [reservations, courses, students] = await Promise.all([
    prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: { title: 'asc' },
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: { firstName: 'asc' },
    }),
  ])

  return <ReservationsClient reservations={reservations} courses={courses} students={students} />
}
