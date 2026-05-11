import { NextResponse } from 'next/server'
import { getCurrentUserWithRole } from '@/lib/user-roles'

// Get current user's role
export async function GET() {
  try {
    const user = await getCurrentUserWithRole()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      role: user.role,
      isActive: user.isActive,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    )
  }
}
