'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  service: {
    title: string
    category: string
  }
  booking: {
    id: string
  }
}

interface ReviewsStats {
  totalReviews: number
  averageRating: number
  recentReviews: Review[]
}

export function useUserReviews() {
  const [reviewsStats, setReviewsStats] = useState<ReviewsStats | null>(null)
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
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getToken()
        if (!token) {
          throw new Error('No access token found')
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fixelo.app/api'

        // Buscar todas as reviews do usuário
        const reviewsResponse = await fetch(`${apiUrl}/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!reviewsResponse.ok) {
          throw new Error(`Reviews API error: ${reviewsResponse.status}`)
        }

        const reviewsData = await reviewsResponse.json()
        const allReviews = reviewsData.data || reviewsData.reviews || []

        // Calcular estatísticas das reviews
        const totalReviews = allReviews.length
        const averageRating = totalReviews > 0 
          ? allReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
          : 0

        // Pegar as 3 reviews mais recentes
        const recentReviews = allReviews
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)

        setReviewsStats({
          totalReviews,
          averageRating,
          recentReviews
        })

      } catch (err) {
        console.error('Reviews fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews data')
      } finally {
        setLoading(false)
      }
    }

    if (user && isAuthenticated) {
      fetchReviews()
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

      // Buscar todas as reviews do usuário
      const reviewsResponse = await fetch(`${apiUrl}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!reviewsResponse.ok) {
        throw new Error(`Reviews API error: ${reviewsResponse.status}`)
      }

      const reviewsData = await reviewsResponse.json()
      const allReviews = reviewsData.data || reviewsData.reviews || []

      // Calcular estatísticas das reviews
      const totalReviews = allReviews.length
      const averageRating = totalReviews > 0 
        ? allReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
        : 0

      // Pegar as 3 reviews mais recentes
      const recentReviews = allReviews
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)

      setReviewsStats({
        totalReviews,
        averageRating,
        recentReviews
      })

    } catch (err) {
      console.error('Reviews fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews data')
    } finally {
      setLoading(false)
    }
  }

  return {
    reviewsStats,
    loading,
    error,
    refetch
  }
}
