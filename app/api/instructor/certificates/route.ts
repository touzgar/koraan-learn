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

    const certificates = await prisma.certificate.findMany({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    })

    return NextResponse.json({
      certificates: certificates.map((cert) => ({
        id: cert.id,
        studentName: `${cert.student.firstName || ''} ${cert.student.lastName || ''}`.trim() || 'No Name',
        studentEmail: cert.student.email,
        courseName: cert.course.title,
        issueDate: cert.issuedAt.toISOString(),
        certificateId: cert.id,
        status: 'Issued',
      })),
    })
  } catch (error) {
    console.error('Certificates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}
