import { useState, useEffect } from 'react'

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
      // Simular um usuário para teste
      setUser({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'PROVIDER'
      })
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    // Simular login
    const mockUser = {
      id: '1',
      email,
      firstName: 'Test',
      lastName: 'User',
      role: 'PROVIDER' as const
    }
    setUser(mockUser)
    localStorage.setItem('auth_token', 'mock_token')
    return Promise.resolve(mockUser)
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