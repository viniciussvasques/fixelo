'use client'

import { useState, useEffect } from 'react'
import { Booking } from '@/types/api'

export interface BookingStats {
  total: number
  pending: number
  confirmed: number
  inProgress: number
  completed: number
  cancelled: number
  rejected: number
}

export const useUserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      
      const response = await fetch(`${apiUrl}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      console.log('📅 Bookings API Response:', data)
      
      const bookingsData = data.data || data.bookings || []
      setBookings(bookingsData)

      // Calcular estatísticas
      const statsData: BookingStats = {
        total: bookingsData.length,
        pending: bookingsData.filter((b: Booking) => b.status === 'PENDING').length,
        confirmed: bookingsData.filter((b: Booking) => b.status === 'CONFIRMED').length,
        inProgress: bookingsData.filter((b: Booking) => b.status === 'IN_PROGRESS').length,
        completed: bookingsData.filter((b: Booking) => b.status === 'COMPLETED').length,
        cancelled: bookingsData.filter((b: Booking) => b.status === 'CANCELLED').length,
        rejected: bookingsData.filter((b: Booking) => b.status === 'REJECTED').length,
      }
      setStats(statsData)

    } catch (err) {
      console.error('Erro ao buscar bookings:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const refetch = () => {
    fetchBookings()
  }

  return {
    bookings,
    stats,
    loading,
    error,
    refetch
  }
}
