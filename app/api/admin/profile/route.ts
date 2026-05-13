import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET admin profile
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Get platform stats
    const [totalUsers, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
    ])

    const profile = {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
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
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
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
    const [totalUsers, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
    ])

    const profile = {
      id: updatedUser.id,
      firstName: updatedUser.firstName || '',
      lastName: updatedUser.lastName || '',
      email: updatedUser.email,
      imageUrl: updatedUser.imageUrl,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
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
