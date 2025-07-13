import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

// Query Keys para cache
export const QUERY_KEYS = {
  // Auth
  profile: ['profile'],
  
  // Services
  services: ['services'],
  service: (id: string) => ['services', id],
  userServices: (userId: string) => ['services', 'user', userId],
  categories: ['categories'],
  
  // Bookings
  bookings: ['bookings'],
  booking: (id: string) => ['bookings', id],
  userBookings: (userId: string) => ['bookings', 'user', userId],
  
  // Reviews
  reviews: ['reviews'],
  serviceReviews: (serviceId: string) => ['reviews', 'service', serviceId],
  userReviews: (userId: string) => ['reviews', 'user', userId],
  
  // Payments
  paymentMethods: ['payment-methods'],
  transactions: ['transactions'],
  
  // Plans
  plans: ['plans'],
  
  // Search
  search: (query: string) => ['search', query],
}

// Hook para buscar serviços removido (duplicado em use-services.ts)

// Hook para buscar serviço específico
export const useServiceDetails = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.service(id),
    queryFn: () => apiClient.getService(id),
    select: (data) => data.data.data,
    enabled: !!id,
  })
}

// Hook para buscar categorias removido (duplicado em use-categories.ts)

// Hook para buscar reservas do usuário
export const useUserBookings = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: QUERY_KEYS.userBookings(user?.id || ''),
    queryFn: () => apiClient.getBookings(),
    select: (data) => data.data,
    enabled: !!user?.id,
  })
}

// Hook para buscar reserva específica
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.booking(id),
    queryFn: () => apiClient.getBooking(id),
    select: (data) => data.data.data,
    enabled: !!id,
  })
}

// Hook para buscar reviews de um serviço
export const useServiceReviews = (serviceId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.serviceReviews(serviceId),
    queryFn: () => apiClient.getReviews({ serviceId }),
    select: (data) => data.data,
    enabled: !!serviceId,
  })
}

// Hook para buscar métodos de pagamento
export const usePaymentMethods = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods,
    queryFn: () => apiClient.getPaymentHistory(),
    select: (data) => data.data.data,
    enabled: !!user?.id,
  })
}

// Hook para buscar planos
export const usePlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.plans,
    queryFn: () => apiClient.getPlans(),
    select: (data) => data.data.data,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para buscar perfil do usuário
export const useProfile = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => apiClient.getProfile(),
    select: (data) => data.data.data,
    enabled: !!user?.id,
  })
}

// Mutations para criar/atualizar dados

// Mutation para criar serviço
export const useCreateService = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services })
    },
  })
}

// Mutation para atualizar serviço
export const useUpdateService = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiClient.updateService(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.service(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services })
    },
  })
}

// Mutation para criar reserva
export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings })
    },
  })
}

// Mutation para atualizar reserva
export const useUpdateBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiClient.updateBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings })
    },
  })
}

// Mutation para criar review
export const useCreateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.serviceReviews(variables.serviceId) 
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews })
    },
  })
}

// Mutation para upload de arquivo
export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: FormData) => apiClient.uploadFile(file, 'avatar'),
  })
}

// Mutation para processar pagamento
export const useProcessPayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createPaymentIntent(data.amount, data.bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions })
    },
  })
}

// Hook para busca
export const useSearch = (query: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => apiClient.searchServices(query),
    select: (data) => data.data.data,
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
} 