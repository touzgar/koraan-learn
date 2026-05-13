import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET admin profile
export async function GET() {
  try {
    const user = await requireAdmin()

    // Get platform stats
    const [totalUsers, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
    ])

    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      isActive: user.isActive,
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalCertificates,
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT update admin profile
export async function PUT(req: Request) {
  try {
    const user = await requireAdmin()

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
    const [totalUsers, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
    ])

    const profile = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      imageUrl: updatedUser.imageUrl,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalCertificates,
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
