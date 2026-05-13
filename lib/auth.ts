/**
 * Simple JSON-based Authentication System
 * 
 * NOTE: This is a development/testing authentication system.
 * For production, integrate Clerk or NextAuth.js
 */

import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

// Simple password hashing (for development only)
// In production, use bcrypt or similar
function simpleHash(password: string): string {
  return Buffer.from(password).toString('base64')
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string) {
  // Find user in database
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      imageUrl: true,
    },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  if (!user.isActive) {
    throw new Error('Account is disabled')
  }

  // For development: accept hardcoded passwords
  // In production, check against hashed password in database
  const validPasswords = ['admin123', 'instructor123', 'student123']
  if (validPasswords.includes(password)) {
    return user
  }

  throw new Error('Invalid credentials')
}

/**
 * Create session cookie
 */
export async function createSession(userId: string) {
  const sessionData = {
    userId,
    createdAt: Date.now(),
  }

  const cookieStore = cookies()
  cookieStore.set('session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)
    return session
  } catch (error) {
    return null
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      imageUrl: true,
      createdAt: true,
    },
  })

  return user
}

/**
 * Logout user
 */
export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('session')
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  if (user.role !== UserRole.ADMIN) {
    throw new Error('Access denied. Admin role required.')
  }

  return user
}

/**
 * Ensure admin user exists in database
 */
export async function ensureAdminExists() {
  const adminEmail = 'admin@koraanlearn.com'

  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!admin) {
    // Create admin user
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'KoraanLearn',
        role: UserRole.ADMIN,
        isActive: true,
        clerkId: 'local_admin', // Placeholder for Clerk integration later
      },
    })
  } else if (admin.role !== UserRole.ADMIN) {
    // Update existing user to admin
    admin = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: UserRole.ADMIN, isActive: true },
    })
  }

  return admin
}

/**
 * Ensure instructor user exists in database
 */
export async function ensureInstructorExists() {
  const instructorEmail = 'instructor@koraanlearn.com'

  let instructor = await prisma.user.findUnique({
    where: { email: instructorEmail },
  })

  if (!instructor) {
    // Create instructor user
    instructor = await prisma.user.create({
      data: {
        email: instructorEmail,
        firstName: 'Mohamed',
        lastName: 'Ahmed',
        role: UserRole.INSTRUCTOR,
        isActive: true,
        clerkId: 'local_instructor',
      },
    })
  } else if (instructor.role !== UserRole.INSTRUCTOR) {
    // Update existing user to instructor
    instructor = await prisma.user.update({
      where: { email: instructorEmail },
      data: { role: UserRole.INSTRUCTOR, isActive: true },
    })
  }

  return instructor
}

/**
 * Ensure student user exists in database
 */
export async function ensureStudentExists() {
  const studentEmail = 'student@koraanlearn.com'

  let student = await prisma.user.findUnique({
    where: { email: studentEmail },
  })

  if (!student) {
    // Create student user
    student = await prisma.user.create({
      data: {
        email: studentEmail,
        firstName: 'Fatima',
        lastName: 'Hassan',
        role: UserRole.STUDENT,
        isActive: true,
        clerkId: 'local_student',
      },
    })
  } else if (student.role !== UserRole.STUDENT) {
    // Update existing user to student
    student = await prisma.user.update({
      where: { email: studentEmail },
      data: { role: UserRole.STUDENT, isActive: true },
    })
  }

  return student
}
