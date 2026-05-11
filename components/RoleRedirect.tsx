'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RoleRedirect() {
  const router = useRouter()

  useEffect(() => {
    async function checkRole() {
      try {
        // Sync current user to database
        await fetch('/api/sync-current-user', { method: 'POST' })
        
        // Get user role
        const response = await fetch('/api/user/role')
        if (response.ok) {
          const data = await response.json()
          
          // Redirect based on role
          if (data.role === 'ADMIN') {
            router.push('/admin')
          } else if (data.role === 'INSTRUCTOR') {
            router.push('/instructor')
          }
        }
      } catch (error) {
        console.error('Error checking role:', error)
      }
    }

    checkRole()
  }, [router])

  return null
}
