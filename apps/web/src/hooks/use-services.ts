import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface UseServicesParams {
  providerId?: string | 'current'
  category?: string
  status?: string
  page?: number
  limit?: number
  search?: string
  city?: string
  priceMin?: number
  priceMax?: number
  sortBy?: string
}

export const useServices = (params?: UseServicesParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      let endpoint = '/services'
      
      // Se for 'current', buscar serviços do provedor logado
      if (params?.providerId === 'current') {
        endpoint = '/services/provider'
      } else if (params?.providerId) {
        endpoint = `/services/provider/${params.providerId}`
      }
      
      const queryParams = {
        ...params,
        providerId: params?.providerId === 'current' ? undefined : params?.providerId
      }
      
      const response = await api.get(endpoint, { params: queryParams })
      // Handle API response structure
      const services = response.data?.services || response.data?.data || response.data || []
      return Array.isArray(services) ? services : []
    }
  })
}

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: async () => {
      const response = await api.get(`/services/${id}`)
      return response.data?.data || response.data
    },
    enabled: !!id
  })
}

// Hook para busca de serviços com filtros
export const useServicesSearch = () => {
  const queryClient = useQueryClient()
  
  const searchServices = useMutation({
    mutationFn: async (filters: UseServicesParams) => {
      const response = await api.get('/services', { params: filters })
      // Handle API response structure
      const services = response.data?.services || response.data?.data || response.data || []
      return Array.isArray(services) ? services : []
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['services', 'search'], data)
    }
  })
  
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', 'search'],
    queryFn: async () => {
      const response = await api.get('/services')
      // Handle API response structure and ensure it's always an array
      const data = response.data?.services || response.data?.data || response.data || []
      return Array.isArray(data) ? data : []
    },
    initialData: []
  })
  
  return {
    services: Array.isArray(services) ? services : [],
    isLoading,
    searchServices: searchServices.mutate
  }
} 