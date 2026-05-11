import { prisma } from '@/lib/prisma'
import UsersClient from '@/components/admin/UsersClient'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          coursesCreated: true,
          enrollments: true,
          certificates: true,
        },
      },
    },
  })

  return <UsersClient users={users} />
}
