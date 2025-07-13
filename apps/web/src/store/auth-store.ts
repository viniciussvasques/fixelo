import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/api'

// Helper para ler token do cookie (não HttpOnly)
function getCookieToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

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
  initializeAuth: () => Promise<void>
  setUser: (user: User | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
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
    (set, _get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Ação para inicializar autenticação
      initializeAuth: async () => {
        try {
          console.log('🔄 initializeAuth - Starting...')
          set({ isLoading: true })
          
          const token = localStorage.getItem('auth_token') || getCookieToken()
          const refreshToken = localStorage.getItem('refresh_token')
          
          console.log('🔐 initializeAuth - token:', token ? 'exists' : 'missing')
          console.log('🔐 initializeAuth - refresh token:', refreshToken ? 'exists' : 'missing')
          
          if (!token) {
            console.log('❌ initializeAuth - No token found, setting unauthenticated')
            set({ isLoading: false, isAuthenticated: false, user: null })
            return
          }
          
          console.log('🔄 initializeAuth - Validating token with API...')
          
          // Verificar se o token é válido fazendo uma requisição ao perfil
          try {
            const response = await apiClient.getProfile()
            // A API retorna o user dentro da propriedade data
            const user = response.data.data || response.data
            
            console.log('✅ initializeAuth - Token valid, user:', user)
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (error: any) {
            console.log('❌ initializeAuth - Token invalid:', error.response?.status, error.response?.data?.message)
            console.log('🔄 initializeAuth - Clearing auth tokens')
            
            // Token inválido, limpar
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('❌ initializeAuth - Unexpected error:', error)
          set({ isLoading: false })
        }
      },

      // Ação de login
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.login(email, password)
          const { user, accessToken, refreshToken } = response.data

          // Salvar tokens no localStorage
          localStorage.setItem('auth_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)
          // Também salvar em cookie (não HttpOnly) para middleware no lado do servidor
          document.cookie = `auth_token=${accessToken}; path=/; SameSite=Lax`;

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
          document.cookie = `auth_token=${accessToken}; path=/; SameSite=Lax`;

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
          document.cookie = 'auth_token=; Max-Age=0; path=/;'
          
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

      // Definir usuário
      setUser: (user: User | null) => {
        set({ user })
      },

      // Definir se está autenticado
      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated })
      },
    }),
    {
      name: 'auth-storage', // required to persist state across tabs
      skipHydration: true,
    },
  ),
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