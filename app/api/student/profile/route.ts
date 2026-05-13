import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET student profile
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
        lessonProgress: true,
      },
    })

    // Get certificates
    const certificates = await prisma.certificate.count({
      where: { studentId: user.id },
    })

    // Calculate stats
    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(
      (e) => e.status === 'COMPLETED'
    ).length

    // Calculate average progress
    const averageProgress =
      totalCourses > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses
          )
        : 0

    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      stats: {
        totalCourses,
        completedCourses,
        certificates,
        averageProgress,
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT update student profile
export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName } = body

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      },
    })

    // Get updated stats
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
        lessonProgress: true,
      },
    })

    const certificates = await prisma.certificate.count({
      where: { studentId: user.id },
    })

    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(
      (e) => e.status === 'COMPLETED'
    ).length

    const averageProgress =
      totalCourses > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses
          )
        : 0

    const profile = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      imageUrl: updatedUser.imageUrl,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      stats: {
        totalCourses,
        completedCourses,
        certificates,
        averageProgress,
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating student profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
