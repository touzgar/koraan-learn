'use client'

import { motion } from 'framer-motion'
import { CourseStatus } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BookOpen, Users, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentCourse {
  id: string
  title: string
  status: CourseStatus
  createdAt: Date
  instructor: {
    firstName: string | null
    lastName: string | null
  }
  _count: {
    enrollments: number
  }
}

interface RecentCoursesProps {
  courses: RecentCourse[]
}

const statusConfig = {
  DRAFT: {
    label: 'Brouillon',
    color: 'text-gray-700 bg-gray-100',
  },
  PUBLISHED: {
    label: 'Publié',
    color: 'text-green-700 bg-green-100',
  },
  ARCHIVED: {
    label: 'Archivé',
    color: 'text-orange-700 bg-orange-100',
  },
}

export default function RecentCourses({ courses }: RecentCoursesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-900/5 border border-emerald-100"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Cours Récents
      </h2>
      <div className="space-y-4">
        {courses.map((course, index) => {
          const config = statusConfig[course.status]

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Par {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course._count.enrollments} inscrits
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(course.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                  config.color
                )}>
                  {config.label}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
