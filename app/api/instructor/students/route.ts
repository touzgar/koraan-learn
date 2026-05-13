import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all students with role STUDENT
    const allStudents = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get enrollments for instructor's courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      include: {
        student: {
          select: {
            id: true,
          },
        },
      },
    })

    // Create a map of student enrollments
    const enrollmentMap = new Map()
    enrollments.forEach((enrollment) => {
      const studentId = enrollment.student.id
      if (!enrollmentMap.has(studentId)) {
        enrollmentMap.set(studentId, {
          enrolledCourses: 0,
          completedCourses: 0,
          totalProgress: 0,
          lastActive: enrollment.enrolledAt,
        })
      }
      const data = enrollmentMap.get(studentId)
      data.enrolledCourses++
      if (enrollment.status === 'COMPLETED') {
        data.completedCourses++
      }
      data.totalProgress += enrollment.progress
      if (enrollment.enrolledAt > data.lastActive) {
        data.lastActive = enrollment.enrolledAt
      }
    })

    // Combine student data with enrollment data
    const students = allStudents.map((student) => {
      const enrollmentData = enrollmentMap.get(student.id)
      
      if (enrollmentData) {
        return {
          id: student.id,
          name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'No Name',
          email: student.email,
          enrolledCourses: enrollmentData.enrolledCourses,
          completedCourses: enrollmentData.completedCourses,
          progress: Math.round(enrollmentData.totalProgress / enrollmentData.enrolledCourses) || 0,
          lastActive: new Date(enrollmentData.lastActive).toLocaleDateString(),
        }
      } else {
        // Student not enrolled in any of instructor's courses
        return {
          id: student.id,
          name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'No Name',
          email: student.email,
          enrolledCourses: 0,
          completedCourses: 0,
          progress: 0,
          lastActive: new Date(student.updatedAt).toLocaleDateString(),
        }
      }
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Students error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
