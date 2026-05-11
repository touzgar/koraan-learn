import { prisma } from './prisma'
import { NotificationType } from '@prisma/client'

interface CreateNotificationParams {
  type: NotificationType
  title: string
  description: string
  details?: string
  entityId?: string
  entityType?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type: params.type,
        title: params.title,
        description: params.description,
        details: params.details || null,
        entityId: params.entityId || null,
        entityType: params.entityType || null,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

// Notification templates
export const NotificationTemplates = {
  newUser: (user: { firstName: string; lastName: string; email: string; role: string; id: string }) => ({
    type: 'NEW_USER' as NotificationType,
    title: 'New User Registration',
    description: `${user.firstName} ${user.lastName} joined as ${user.role}`,
    details: user.email,
    entityId: user.id,
    entityType: 'USER',
  }),

  newCourse: (course: { title: string; id: string }, instructor: { firstName: string; lastName: string }) => ({
    type: 'NEW_COURSE' as NotificationType,
    title: 'New Course Created',
    description: course.title,
    details: `by ${instructor.firstName} ${instructor.lastName}`,
    entityId: course.id,
    entityType: 'COURSE',
  }),

  draftCourse: (course: { title: string; id: string }, instructor: { firstName: string; lastName: string }) => ({
    type: 'DRAFT_COURSE' as NotificationType,
    title: 'Course Pending Review',
    description: course.title,
    details: `by ${instructor.firstName} ${instructor.lastName}`,
    entityId: course.id,
    entityType: 'COURSE',
  }),

  newEnrollment: (
    student: { firstName: string; lastName: string },
    course: { title: string },
    enrollmentId: string
  ) => ({
    type: 'NEW_ENROLLMENT' as NotificationType,
    title: 'New Enrollment',
    description: `${student.firstName} ${student.lastName} enrolled in`,
    details: course.title,
    entityId: enrollmentId,
    entityType: 'ENROLLMENT',
  }),

  completedEnrollment: (
    student: { firstName: string; lastName: string },
    course: { title: string },
    enrollmentId: string
  ) => ({
    type: 'COMPLETED_ENROLLMENT' as NotificationType,
    title: 'Course Completed',
    description: `${student.firstName} ${student.lastName} completed`,
    details: course.title,
    entityId: enrollmentId,
    entityType: 'ENROLLMENT',
  }),

  cancelledEnrollment: (
    student: { firstName: string; lastName: string },
    course: { title: string },
    enrollmentId: string
  ) => ({
    type: 'CANCELLED_ENROLLMENT' as NotificationType,
    title: 'Enrollment Cancelled',
    description: `${student.firstName} ${student.lastName} cancelled`,
    details: course.title,
    entityId: enrollmentId,
    entityType: 'ENROLLMENT',
  }),

  inactiveUser: (user: { firstName: string; lastName: string; email: string; id: string }) => ({
    type: 'INACTIVE_USER' as NotificationType,
    title: 'User Deactivated',
    description: `${user.firstName} ${user.lastName} is now inactive`,
    details: user.email,
    entityId: user.id,
    entityType: 'USER',
  }),
}
