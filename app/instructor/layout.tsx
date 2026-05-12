'use client'

import InstructorSidebar from '@/components/instructor/InstructorSidebar'
import InstructorHeader from '@/components/instructor/InstructorHeader'

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <InstructorSidebar />
      <div className="lg:pl-64">
        <InstructorHeader />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
