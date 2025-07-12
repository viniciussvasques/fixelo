import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface CitiesResponse {
  success: boolean
  data: string[]
  meta: {
    totalCities: number
    activeCities: number
  }
}

export const useCities = () => {
  return useQuery({
    queryKey: ['locations', 'cities'],
    queryFn: async () => {
      const { data } = await api.get<CitiesResponse>('/locations/cities')
      return data
    },
    staleTime: 1000 * 60 * 30, // 30 minutos - cidades não mudam com frequência
  })
}

export const useFloridaCities = () => {
  const { data, isLoading, error } = useCities()
  
  return {
    cities: data?.data || [],
    isLoading,
    error,
    totalCities: data?.meta?.totalCities || 0,
    activeCities: data?.meta?.activeCities || 0
  }
} 