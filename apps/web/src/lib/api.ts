import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Cliente axios configurado
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Só tentar renovar token se:
    // 1. Erro 401
    // 2. Não foi uma tentativa de retry
    // 3. Existe um token de autenticação (usuário estava logado)
    // 4. Não é um endpoint público
    const hasAuthToken = getAuthToken()
    const isPublicEndpoint = originalRequest.url?.includes('/auth/') || 
                           originalRequest.url?.includes('/services/categories') ||
                           originalRequest.url?.includes('/locations/cities') ||
                           originalRequest.url?.includes('/health')
    
    if (error.response?.status === 401 && !originalRequest._retry && hasAuthToken && !isPublicEndpoint) {
      originalRequest._retry = true
      
      try {
        await refreshAuthToken()
        const token = getAuthToken()
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Se falhar, redirecionar para login apenas se o usuário estava logado
        clearAuthToken()
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/auth?mode=login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Funções auxiliares para gerenciar token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }
}

async function refreshAuthToken(): Promise<void> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  })

  if (response.data.accessToken) {
    localStorage.setItem('auth_token', response.data.accessToken)
    if (response.data.refreshToken) {
      localStorage.setItem('refresh_token', response.data.refreshToken)
    }
  }
}

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Métodos auxiliares da API
export const apiClient = {
  // Auth
  login: (email: string, password: string) =>
    api.post<{ user: any; accessToken: string; refreshToken: string }>('/auth/login', {
      email,
      password,
    }),

  register: (userData: any) => {
    console.log('🔄 API Client - Enviando dados de registro:', userData)
    return api.post<{ user: any; accessToken: string; refreshToken: string }>('/auth/register', userData)
  },

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse>('/auth/reset-password', { token, password }),



  // User
  getProfile: () => api.get<ApiResponse<any>>('/users/profile'),
  
  updateProfile: (userData: any) =>
    api.patch<ApiResponse<any>>('/users/profile', userData),

  // Services
  getServices: (params?: any) =>
    api.get<ApiResponse<PaginatedResponse<any>>>('/services', { params }),

  getService: (id: string) =>
    api.get<ApiResponse<any>>(`/services/${id}`),

  createService: (serviceData: any) =>
    api.post<ApiResponse<any>>('/services', serviceData),

  updateService: (id: string, serviceData: any) =>
    api.patch<ApiResponse<any>>(`/services/${id}`, serviceData),

  deleteService: (id: string) =>
    api.delete<ApiResponse>(`/services/${id}`),

  // Provider Services
  getProviderServices: () =>
    api.get<ApiResponse<any[]>>('/services/provider'),

  getProviderStats: () =>
    api.get<ApiResponse<any>>('/services/provider/stats'),

  // Bookings
  getBookings: (params?: any) =>
    api.get<ApiResponse<PaginatedResponse<any>>>('/bookings', { params }),

  getBooking: (id: string) =>
    api.get<ApiResponse<any>>(`/bookings/${id}`),

  createBooking: (bookingData: any) =>
    api.post<ApiResponse<any>>('/bookings', bookingData),

  updateBooking: (id: string, bookingData: any) =>
    api.patch<ApiResponse<any>>(`/bookings/${id}`, bookingData),

  cancelBooking: (id: string, reason?: string) =>
    api.post<ApiResponse>(`/bookings/${id}/cancel`, { reason }),

  // Reviews
  getReviews: (params?: any) =>
    api.get<ApiResponse<PaginatedResponse<any>>>('/reviews', { params }),

  createReview: (reviewData: any) =>
    api.post<ApiResponse<any>>('/reviews', reviewData),

  // Payments
  createPaymentIntent: (amount: number, bookingId: string) =>
    api.post<ApiResponse<{ clientSecret: string }>>('/payments/create-intent', {
      amount,
      bookingId,
    }),

  getPaymentHistory: (params?: any) =>
    api.get<ApiResponse<PaginatedResponse<any>>>('/payments/history', { params }),

  // Plans & Subscriptions
  getPlans: () => api.get<ApiResponse<any[]>>('/plans'),

  createSubscription: (planId: string, paymentMethodId: string) =>
    api.post<ApiResponse<any>>('/subscriptions', { planId, paymentMethodId }),

  // Search
  searchServices: (query: string, filters?: any) =>
    api.get<ApiResponse<PaginatedResponse<any>>>('/services/search', {
      params: { q: query, ...filters },
    }),

  // Location
  getCities: () => api.get<ApiResponse<string[]>>('/locations/cities'),
  
  // Categories
  getCategories: () => api.get<ApiResponse<any[]>>('/services/categories'),

  // File upload
  uploadFile: (file: FormData, type: 'avatar' | 'service' | 'document') =>
    api.post<ApiResponse<{ url: string }>>(`/upload/${type}`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Chat/Messages
  getConversations: () => api.get<ApiResponse<any[]>>('/chat/conversations'),
  
  getMessages: (conversationId: string) => 
    api.get<ApiResponse<any[]>>(`/chat/conversations/${conversationId}/messages`),
  
  sendMessage: (data: { conversationId: string; content: string; receiverId: string }) =>
    api.post<ApiResponse<any>>('/chat/messages', data),

  // Email verification
  verifyEmail: (token: string) =>
    api.post<ApiResponse<any>>('/auth/verify-email', { token }),

  resendVerification: (email: string) =>
    api.post<ApiResponse<any>>('/auth/resend-verification', { email }),

  // Platform Stats
  getPlatformStats: () => api.get<ApiResponse<{
    servicesCompleted: number
    verifiedProfessionals: number
    citiesCount: number
    averageRating: number
  }>>('/ads/admin/stats'),
}

export default api 