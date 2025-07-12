import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  duration: number
  images: string[]
  status: string
  isActive: boolean
  providerId: string
  createdAt: string
  updatedAt: string
}

interface UseServicesParams {
  providerId?: string | 'current'
  category?: string
  status?: string
  page?: number
  limit?: number
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
      
      const { data } = await api.get(endpoint, { params: queryParams })
      return data
    }
  })
}

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: async () => {
      const { data } = await api.get(`/services/${id}`)
      return data
    },
    enabled: !!id
  })
} 