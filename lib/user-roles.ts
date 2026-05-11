import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function getCurrentUserWithRole() {
  const cookieStore = cookies()
  const token = cookieStore.get('koraan_token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUserWithRole()
  return user?.role === role
}

export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN)
}

export async function isInstructor(): Promise<boolean> {
  return hasRole(UserRole.INSTRUCTOR)
}

export async function isStudent(): Promise<boolean> {
  return hasRole(UserRole.STUDENT)
}

export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUserWithRole()
  return user ? roles.includes(user.role) : false
}

export async function requireRole(role: UserRole) {
  const hasRequiredRole = await hasRole(role)
  if (!hasRequiredRole) {
    throw new Error(`Access denied. Required role: ${role}`)
  }
}

export async function requireAdmin() {
  await requireRole(UserRole.ADMIN)
}

export async function requireInstructor() {
  await requireRole(UserRole.INSTRUCTOR)
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  await requireAdmin()
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  })
  return updatedUser
}

export async function toggleUserActiveStatus(userId: string) {
  await requireAdmin()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  })
  if (!user) {
    throw new Error('User not found')
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  })
  return updatedUser
}
