import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useCities = () => {
  return useQuery({
    queryKey: ['locations', 'cities'],
    queryFn: async () => {
      try {
        console.log('🌍 Fetching cities...')
        const response = await api.get('/locations/cities')
        console.log('📡 Cities response:', response)
        console.log('📡 Cities response.data:', response.data)
        
        // Handle API response structure
        const result = response.data
        console.log('✅ Final cities result:', result)
        
        return result
      } catch (err: any) {
        console.error('❌ Error fetching cities:', err)
        throw err
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutos - cidades não mudam com frequência
  })
}

export const useFloridaCities = () => {
  const { data, isLoading, error } = useCities()
  
  console.log('🎯 useFloridaCities - data:', data)
  console.log('🎯 useFloridaCities - isLoading:', isLoading)
  console.log('🎯 useFloridaCities - error:', error)
  
  // Extract cities from API response - the API returns { success: true, data: [...cities] }
  const cities = data?.data || []
  const uniqueCities = Array.isArray(cities) ? [...new Set(cities)] : []
  
  console.log('🎯 useFloridaCities - cities (raw):', cities)
  console.log('🎯 useFloridaCities - cities (deduplicated):', uniqueCities)
  
  return {
    cities: uniqueCities,
    isLoading,
    error,
    totalCities: data?.meta?.totalCities || uniqueCities.length,
    activeCities: data?.meta?.activeCities || 0
  }
} 