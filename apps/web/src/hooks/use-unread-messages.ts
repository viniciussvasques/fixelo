'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface UnreadMessagesStats {
  totalUnread: number
  chats: Array<{
    id: string
    unreadCount: number
    lastMessage: {
      content: string
      createdAt: string
    }
    participants: Array<{
      id: string
      firstName: string
      lastName: string
      avatar?: string
    }>
  }>
}

export function useUnreadMessages() {
  const [unreadStats, setUnreadStats] = useState<UnreadMessagesStats | null>(null)
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
    const fetchUnreadMessages = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getToken()
        if (!token) {
          throw new Error('No access token found')
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fixelo.app/api'

        const response = await fetch(`${apiUrl}/chat/chats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Messages API error: ${response.status}`)
        }

        const data = await response.json()
        
        // Calcular total de mensagens não lidas
        const totalUnread = data.chats?.reduce((total: number, chat: any) => total + (chat.unreadCount || 0), 0) || 0
        
        setUnreadStats({
          totalUnread,
          chats: data.chats || []
        })

      } catch (err) {
        console.error('Unread messages fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch unread messages')
      } finally {
        setLoading(false)
      }
    }

    if (user && isAuthenticated) {
      fetchUnreadMessages()
    } else {
      setLoading(false)
    }
  }, [user, isAuthenticated])

  return {
    unreadStats,
    loading,
    error,
    refetch: () => {
      if (user) {
        setLoading(true)
        setError(null)
      }
    }
  }
}
