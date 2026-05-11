import { PrismaClient, NotificationType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding notifications...')

  // Create sample notifications
  const notifications = [
    {
      type: 'NEW_USER' as NotificationType,
      title: 'New User Registration',
      description: 'John Doe joined as STUDENT',
      details: 'john.doe@example.com',
      entityType: 'USER',
    },
    {
      type: 'NEW_COURSE' as NotificationType,
      title: 'New Course Created',
      description: 'Introduction to React',
      details: 'by Jane Smith',
      entityType: 'COURSE',
    },
    {
      type: 'NEW_ENROLLMENT' as NotificationType,
      title: 'New Enrollment',
      description: 'Alice Johnson enrolled in',
      details: 'Advanced JavaScript',
      entityType: 'ENROLLMENT',
    },
    {
      type: 'COMPLETED_ENROLLMENT' as NotificationType,
      title: 'Course Completed',
      description: 'Bob Wilson completed',
      details: 'Python Basics',
      entityType: 'ENROLLMENT',
    },
    {
      type: 'DRAFT_COURSE' as NotificationType,
      title: 'Course Pending Review',
      description: 'Machine Learning Fundamentals',
      details: 'by Dr. Sarah Lee',
      entityType: 'COURSE',
    },
  ]

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification,
    })
  }

  console.log(`Created ${notifications.length} notifications`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
