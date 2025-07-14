'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface PaymentStats {
  totalSpent: number
  thisMonthSpent: number
  thisYearSpent: number
  paymentsCount: number
}

export function useUserPayments() {
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null)
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
    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getToken()
        if (!token) {
          throw new Error('No access token found')
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fixelo.app/api'

        // Buscar histórico de pagamentos
        const paymentsResponse = await fetch(`${apiUrl}/payments/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!paymentsResponse.ok) {
          throw new Error(`Payments API error: ${paymentsResponse.status}`)
        }

        const paymentsData = await paymentsResponse.json()
        const allPayments = paymentsData.data || paymentsData.payments || []

        // Calcular estatísticas
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        let totalSpent = 0
        let thisMonthSpent = 0
        let thisYearSpent = 0

        allPayments.forEach((payment: any) => {
          const paymentDate = new Date(payment.createdAt)
          const amount = payment.amount || 0

          // Total geral
          totalSpent += amount

          // Este ano
          if (paymentDate.getFullYear() === currentYear) {
            thisYearSpent += amount

            // Este mês
            if (paymentDate.getMonth() === currentMonth) {
              thisMonthSpent += amount
            }
          }
        })

        setPaymentStats({
          totalSpent,
          thisMonthSpent,
          thisYearSpent,
          paymentsCount: allPayments.length
        })

      } catch (err) {
        console.error('Payments fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch payments data')
      } finally {
        setLoading(false)
      }
    }

    if (user && isAuthenticated) {
      fetchPayments()
    } else {
      setLoading(false)
    }
  }, [user, isAuthenticated])

  const refetch = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)

      const token = getToken()
      if (!token) {
        throw new Error('No access token found')
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fixelo.app/api'

      const paymentsResponse = await fetch(`${apiUrl}/payments/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!paymentsResponse.ok) {
        throw new Error(`Payments API error: ${paymentsResponse.status}`)
      }

      const paymentsData = await paymentsResponse.json()
      const allPayments = paymentsData.data || paymentsData.payments || []

      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      let totalSpent = 0
      let thisMonthSpent = 0
      let thisYearSpent = 0

      allPayments.forEach((payment: any) => {
        const paymentDate = new Date(payment.createdAt)
        const amount = payment.amount || 0

        totalSpent += amount

        if (paymentDate.getFullYear() === currentYear) {
          thisYearSpent += amount

          if (paymentDate.getMonth() === currentMonth) {
            thisMonthSpent += amount
          }
        }
      })

      setPaymentStats({
        totalSpent,
        thisMonthSpent,
        thisYearSpent,
        paymentsCount: allPayments.length
      })

    } catch (err) {
      console.error('Payments fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch payments data')
    } finally {
      setLoading(false)
    }
  }

  return {
    paymentStats,
    loading,
    error,
    refetch
  }
}
