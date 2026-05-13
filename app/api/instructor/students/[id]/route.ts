import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Check if student has STUDENT role
    const fullStudent = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true },
    })

    if (fullStudent?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'User is not a student' }, { status: 400 })
    }

    // Get enrollments for this student in instructor's courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: params.id,
        course: {
          instructorId: user.id,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    const studentData = {
      id: student.id,
      name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'No Name',
      email: student.email,
      enrolledCourses: enrollments.length,
      completedCourses: enrollments.filter((e) => e.status === 'COMPLETED').length,
      progress:
        enrollments.length > 0
          ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
          : 0,
      lastActive:
        enrollments.length > 0
          ? new Date(Math.max(...enrollments.map((e) => e.enrolledAt.getTime()))).toLocaleDateString()
          : new Date(student.updatedAt).toLocaleDateString(),
      courses: enrollments.map((e) => ({
        id: e.course.id,
        title: e.course.title,
        progress: Math.round(e.progress),
        status: e.status,
        enrolledAt: e.enrolledAt.toISOString(),
      })),
    }

    return NextResponse.json({ student: studentData })
  } catch (error) {
    console.error('Get student details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student details' },
      { status: 500 }
    )
  }
}
