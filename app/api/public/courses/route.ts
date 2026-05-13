import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    })

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: 'Tous niveaux',
      duration: `${course._count.lessons} leçons`,
      students: course._count.enrollments,
      rating: 4.8, // You can calculate this from reviews if you have them
      image: course.imageUrl || 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=250&fit=crop',
      price: `${course.price}€`,
      tags: ['Tous niveaux'],
      instructor: `${course.instructor.firstName || 'Unknown'} ${course.instructor.lastName || ''}`,
    }))

    return NextResponse.json({ courses: formattedCourses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ courses: [] })
  }
}
