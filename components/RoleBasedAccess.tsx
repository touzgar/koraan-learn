import { getCurrentUserWithRole } from '@/lib/user-roles'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

interface RoleBasedAccessProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * Component to restrict access based on user roles
 * 
 * @example
 * // Only admins can see this content
 * <RoleBasedAccess allowedRoles={[UserRole.ADMIN]}>
 *   <AdminPanel />
 * </RoleBasedAccess>
 * 
 * @example
 * // Admins and instructors can see this
 * <RoleBasedAccess allowedRoles={[UserRole.ADMIN, UserRole.INSTRUCTOR]}>
 *   <CourseManagement />
 * </RoleBasedAccess>
 */
export async function RoleBasedAccess({
  allowedRoles,
  children,
  fallback,
  redirectTo,
}: RoleBasedAccessProps) {
  const user = await getCurrentUserWithRole()

  // If user is not logged in
  if (!user) {
    if (redirectTo) {
      redirect(redirectTo)
    }
    return fallback || <div>Access denied. Please log in.</div>
  }

  // If user doesn't have required role
  if (!allowedRoles.includes(user.role)) {
    if (redirectTo) {
      redirect(redirectTo)
    }
    return fallback || <div>Access denied. Insufficient permissions.</div>
  }

  // User has required role
  return <>{children}</>
}

/**
 * Show content only to admins
 */
export async function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={[UserRole.ADMIN]}>
      {children}
    </RoleBasedAccess>
  )
}

/**
 * Show content only to instructors
 */
export async function InstructorOnly({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={[UserRole.INSTRUCTOR]}>
      {children}
    </RoleBasedAccess>
  )
}

/**
 * Show content only to students
 */
export async function StudentOnly({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={[UserRole.STUDENT]}>
      {children}
    </RoleBasedAccess>
  )
}

/**
 * Show content to admins and instructors
 */
export async function InstructorOrAdmin({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={[UserRole.ADMIN, UserRole.INSTRUCTOR]}>
      {children}
    </RoleBasedAccess>
  )
}
