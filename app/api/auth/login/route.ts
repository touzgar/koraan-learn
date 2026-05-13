import { NextResponse } from 'next/server'
import { loginUser, createSession, ensureAdminExists, ensureInstructorExists, ensureStudentExists } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Ensure default users exist
    await ensureAdminExists()
    await ensureInstructorExists()
    await ensureStudentExists()

    // Login user
    const user = await loginUser(email, password)

    // Create session
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    )
  }
}
