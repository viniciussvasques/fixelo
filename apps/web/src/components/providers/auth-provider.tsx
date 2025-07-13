'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      initializeAuth()
    }
  }, [mounted, initializeAuth])

  return <>{children}</>
} 