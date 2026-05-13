'use client'

import { useState } from 'react'
import StudentSidebar from './StudentSidebar'
import StudentHeader from './StudentHeader'

interface StudentLayoutClientProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    imageUrl?: string | null
  }
  children: React.ReactNode
}

export default function StudentLayoutClient({ user, children }: StudentLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-emerald-50/30 to-cream-50">
      <StudentHeader 
        user={user} 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <StudentSidebar 
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />
      <main className="lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
