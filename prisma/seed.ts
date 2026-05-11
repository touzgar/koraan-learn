import { PrismaClient, UserRole } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@koraanlearn.com' },
    update: {
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      clerkId: 'seed_admin_' + Date.now(),
      email: 'admin@koraanlearn.com',
      firstName: 'Admin',
      lastName: 'KoraanLearn',
      role: UserRole.ADMIN,
      isActive: true,
    },
  })

  console.log('✅ Admin user created/updated:')
  console.log('   📧 Email: admin@koraanlearn.com')
  console.log('   👤 Role: ADMIN')
  console.log('   🆔 ID:', admin.id)

  // Create sample instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@koraanlearn.com' },
    update: {
      role: UserRole.INSTRUCTOR,
      isActive: true,
    },
    create: {
      clerkId: 'seed_instructor_' + Date.now(),
      email: 'instructor@koraanlearn.com',
      firstName: 'Mohamed',
      lastName: 'Ahmed',
      role: UserRole.INSTRUCTOR,
      isActive: true,
    },
  })

  console.log('✅ Instructor user created/updated:')
  console.log('   📧 Email: instructor@koraanlearn.com')
  console.log('   👤 Role: INSTRUCTOR')

  // Create sample student
  const student = await prisma.user.upsert({
    where: { email: 'student@koraanlearn.com' },
    update: {
      role: UserRole.STUDENT,
      isActive: true,
    },
    create: {
      clerkId: 'seed_student_' + Date.now(),
      email: 'student@koraanlearn.com',
      firstName: 'Fatima',
      lastName: 'Hassan',
      role: UserRole.STUDENT,
      isActive: true,
    },
  })

  console.log('✅ Student user created/updated:')
  console.log('   📧 Email: student@koraanlearn.com')
  console.log('   👤 Role: STUDENT')

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'coran-memorisation' },
      update: {},
      create: {
        name: 'Mémorisation du Coran',
        slug: 'coran-memorisation',
        description: 'Apprenez à mémoriser le Coran avec des techniques éprouvées',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tajwid' },
      update: {},
      create: {
        name: 'Tajwid',
        slug: 'tajwid',
        description: 'Maîtrisez les règles de récitation du Coran',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tafsir' },
      update: {},
      create: {
        name: 'Tafsir',
        slug: 'tafsir',
        description: 'Comprenez le sens et l\'interprétation du Coran',
      },
    }),
  ])

  console.log('✅ Categories created:', categories.length)

  // Create sample course
  const course = await prisma.course.upsert({
    where: { id: 'sample_course_1' },
    update: {},
    create: {
      id: 'sample_course_1',
      title: 'Sourate Al-Mulk - Mémorisation Complète',
      description: 'Apprenez à mémoriser la Sourate Al-Mulk avec des techniques de mémorisation efficaces',
      price: 29.99,
      status: 'PUBLISHED',
      isPublished: true,
      instructorId: instructor.id,
      categoryId: categories[0].id,
    },
  })

  console.log('✅ Sample course created:', course.title)

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📝 NEXT STEPS:')
  console.log('1. Go to Clerk Dashboard: https://dashboard.clerk.com')
  console.log('2. Create these users in Clerk:')
  console.log('   • admin@koraanlearn.com (password: admin123)')
  console.log('   • instructor@koraanlearn.com (password: instructor123)')
  console.log('   • student@koraanlearn.com (password: student123)')
  console.log('3. The webhook will automatically sync the clerkId')
  console.log('4. Login and test!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
