import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import SpacesClient from '@/components/admin/SpacesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SpacesPage() {
  const user = await getCurrentUser()
  
  const [spaces, categories, instructors] = await Promise.all([
    prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: { firstName: 'asc' },
    }),
  ])

  return <SpacesClient spaces={spaces} categories={categories} instructors={instructors} />
}
