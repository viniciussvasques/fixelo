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
  planType?: 'FREE' | 'PRO'
  planExpiresAt?: string | undefined
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
  updateUserPlan: (planType: 'FREE' | 'PRO', planExpiresAt?: string) => void
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
            
            // Token inválido, limpar todos os tokens
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
            
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
          console.error('❌ Auth Store - Erro ao fazer login:', error)
          console.error('❌ Auth Store - Detalhes do erro:', error.response?.data || error.message)
          
          let errorMessage = 'Erro ao fazer login'
          
          // Extrair mensagem de erro do response
          if (error.response?.data) {
            const responseData = error.response.data
            if (typeof responseData === 'string') {
              errorMessage = responseData
            } else if (responseData.message) {
              if (typeof responseData.message === 'string') {
                errorMessage = responseData.message
              } else {
                errorMessage = 'Credenciais inválidas'
              }
            }
          } else if (error.message) {
            errorMessage = error.message
          }
          
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
          
          let errorMessage = 'Erro ao criar conta'
          
          // Extrair mensagem de erro do response
          if (error.response?.data) {
            const responseData = error.response.data
            if (typeof responseData === 'string') {
              errorMessage = responseData
            } else if (responseData.message) {
              if (typeof responseData.message === 'string') {
                const msg = responseData.message.toLowerCase()
                // Verificar mensagens específicas da API
                if (msg.includes('user with this email already exists')) {
                  errorMessage = 'Este email já está em uso'
                } else if (msg.includes('user with this phone number already exists')) {
                  errorMessage = 'Este telefone já está em uso'
                } else if (msg.includes('invalid phone number format')) {
                  errorMessage = 'Formato de telefone inválido'
                } else if (msg.includes('email') || msg.includes('Email')) {
                  errorMessage = 'Este email já está em uso'
                } else if (msg.includes('phone') || msg.includes('telefone') || msg.includes('Phone')) {
                  errorMessage = 'Este telefone já está em uso'
                } else {
                  errorMessage = responseData.message
                }
              } else if (responseData.message.email) {
                errorMessage = 'Este email já está em uso'
              } else if (responseData.message.phone) {
                errorMessage = 'Este telefone já está em uso'
              } else {
                errorMessage = 'Erro de validação. Verifique os dados informados.'
              }
            } else if (error.response.status === 409) {
              // Status 409 é conflito, provavelmente email ou telefone duplicado
              errorMessage = 'Email ou telefone já está em uso. Tente com outros dados.'
            }
          } else if (error.message) {
            errorMessage = error.message
          }
          
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
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
          
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

      // Atualizar plano do usuário (para usar após pagamento bem-sucedido)
      updateUserPlan: (planType: 'FREE' | 'PRO', planExpiresAt?: string) => {
        const currentUser = _get().user
        if (currentUser) {
          console.log('🔄 AuthStore - Atualizando plano do usuário para:', planType)
          const updatedUser: User = {
            ...currentUser,
            planType,
            planExpiresAt: planExpiresAt || currentUser.planExpiresAt,
          }
          set({ user: updatedUser })
          console.log('✅ AuthStore - Plano atualizado no store')
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