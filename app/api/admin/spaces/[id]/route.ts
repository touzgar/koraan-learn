import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET single space
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const space = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: true,
        category: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    return NextResponse.json(space)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch space' }, { status: 500 })
  }
}

// PUT update space
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, instructorId, categoryId, status } = body

    const space = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        instructorId,
        categoryId: categoryId || null,
        status: status || 'DRAFT',
        isPublished: status === 'PUBLISHED',
      },
    })

    return NextResponse.json(space)
  } catch (error) {
    console.error('Error updating space:', error)
    return NextResponse.json({ error: 'Failed to update space' }, { status: 500 })
  }
}

// DELETE space
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Space deleted successfully' })
  } catch (error) {
    console.error('Error deleting space:', error)
    return NextResponse.json({ error: 'Failed to delete space' }, { status: 500 })
  }
}
