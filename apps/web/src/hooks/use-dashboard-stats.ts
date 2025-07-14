'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  totalRevenue: number
}

interface RecentBooking {
  id: string
  service: {
    title: string
    category: string
    price: number
    images: string[]
  }
  client?: {
    firstName: string
    lastName: string
    avatar: string
  }
  provider?: {
    firstName: string
    lastName: string
    businessName: string
    avatar: string
  }
  status: string
  scheduledAt: string
  totalAmount: number
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuthStore()

  // Função para obter o token
  const getToken = () => {
    return localStorage.getItem('auth_token') || 
           (typeof document !== 'undefined' ? 
             document.cookie.match(/(?:^|; )auth_token=([^;]+)/)?.[1] : 
             null)
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getToken()
        if (!token) {
          throw new Error('No access token found')
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fixelo.app/api'

        // Buscar todos os bookings para calcular estatísticas
        const bookingsResponse = await fetch(`${apiUrl}/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!bookingsResponse.ok) {
          throw new Error(`Bookings API error: ${bookingsResponse.status}`)
        }

        const bookingsData = await bookingsResponse.json()
        const allBookings = bookingsData.data || bookingsData.bookings || []

        // Calcular estatísticas baseadas nos bookings
        const calculatedStats: DashboardStats = {
          totalBookings: allBookings.length,
          pendingBookings: allBookings.filter((b: any) => b.status === 'PENDING').length,
          confirmedBookings: allBookings.filter((b: any) => b.status === 'CONFIRMED').length,
          completedBookings: allBookings.filter((b: any) => b.status === 'COMPLETED').length,
          cancelledBookings: allBookings.filter((b: any) => b.status === 'CANCELLED').length,
          totalRevenue: allBookings.reduce((sum: number, b: any) => {
            return b.status === 'COMPLETED' ? sum + (b.totalAmount || 0) : sum
          }, 0)
        }

        setStats(calculatedStats)
        
        // Pegar os 5 agendamentos mais recentes
        const recentBookings = allBookings
          .sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
          .slice(0, 5)
        
        setRecentBookings(recentBookings)

      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user && isAuthenticated) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user, isAuthenticated])

  return {
    stats,
    recentBookings,
    loading,
    error,
    refetch: () => {
      if (user) {
        setLoading(true)
        setError(null)
        // Re-run the effect
      }
    }
  }
}
