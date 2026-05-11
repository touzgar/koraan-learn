import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/user-roles'

// Get all users (Admin only)
export async function GET(req: NextRequest) {
  try {
    // Check if current user is admin
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')
    const isActive = searchParams.get('isActive')

    // Build filter
    const where: any = {}
    if (role) where.role = role
    if (isActive !== null) where.isActive = isActive === 'true'

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            coursesCreated: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    
    if (error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
