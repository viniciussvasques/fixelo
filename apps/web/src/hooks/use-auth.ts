import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN'
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Verificar se o token é válido fazendo uma chamada para o perfil
      apiClient.getProfile()
        .then((response) => {
          if (response.data?.data) {
            setUser(response.data.data)
          } else {
            // Token inválido, limpar
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
          }
        })
        .catch(() => {
          // Token inválido, limpar
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      
      if (response.data?.accessToken && response.data?.user) {
        // Armazenar tokens
        localStorage.setItem('auth_token', response.data.accessToken)
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }
        
        setUser(response.data.user)
        return response.data.user
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  }
} 