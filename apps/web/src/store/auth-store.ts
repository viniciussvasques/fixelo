import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/api'

// Tipos para o store de autenticação
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED'
  preferredLanguage: 'PT' | 'EN' | 'ES'
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  // Estado
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Ações
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: 'CLIENT' | 'PROVIDER'
  preferredLanguage?: 'PT' | 'EN' | 'ES'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Ação de login
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.login(email, password)
          const { user, accessToken, refreshToken } = response.data

          // Salvar tokens no localStorage
          localStorage.setItem('auth_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro ao fazer login'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          })
          throw error
        }
      },

      // Ação de registro
      register: async (userData: RegisterData) => {
        try {
          console.log('🔄 Auth Store - Iniciando registro:', userData)
          set({ isLoading: true, error: null })

          const response = await apiClient.register(userData)
          console.log('✅ Auth Store - Resposta da API:', response.data)
          
          const { user, accessToken, refreshToken } = response.data

          // Salvar tokens no localStorage
          localStorage.setItem('auth_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          console.log('✅ Auth Store - Usuário registrado com sucesso:', user)
        } catch (error: any) {
          console.error('❌ Auth Store - Erro ao registrar:', error)
          console.error('❌ Auth Store - Detalhes do erro:', error.response?.data || error.message)
          
          const errorMessage = error.response?.data?.message || 'Erro ao criar conta'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          })
          throw error
        }
      },

      // Ação de logout
      logout: () => {
        try {
          // Chamar API de logout
          apiClient.logout().catch(() => {
            // Ignorar erro de logout da API
          })
        } catch (error) {
          // Ignorar erro
        } finally {
          // Limpar estado e localStorage
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          })
        }
      },

      // Atualizar perfil
      updateProfile: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.updateProfile(userData)
          const updatedUser = response.data.data

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      // Limpar erro
      clearError: () => {
        set({ error: null })
      },

      // Definir loading
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'fixelo-auth', // Nome da chave no localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // Persistir apenas dados essenciais
    }
  )
)

// Hook para verificar se usuário está logado e é um tipo específico
export const useAuthGuard = () => {
  const { user, isAuthenticated } = useAuthStore()

  return {
    isAuthenticated,
    user,
    isClient: user?.role === 'CLIENT',
    isProvider: user?.role === 'PROVIDER',
    isAdmin: user?.role === 'ADMIN',
    canAccessProviderFeatures: user?.role === 'PROVIDER' || user?.role === 'ADMIN',
    canAccessAdminFeatures: user?.role === 'ADMIN',
  }
} 