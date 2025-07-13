import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  serviceCount?: number
}

export function useCategories() {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching categories...')
        const response = await api.get('/services/categories')
        console.log('📡 Categories response:', response)
        console.log('📡 Categories response.data:', response.data)
        
        // Handle API response structure and ensure it's always an array
        const categories = response.data?.categories || response.data?.data || response.data || []
        console.log('📦 Processed categories:', categories)
        
        const result = Array.isArray(categories) ? categories : []
        console.log('✅ Final categories result:', result)
        
        return result
      } catch (err: any) {
        console.error('❌ Error fetching categories:', err)
        throw err
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fallback to mock data if API fails or during development
  const mockCategories: Category[] = [
    { id: '1', name: 'Cleaning', slug: 'cleaning', icon: 'broom', serviceCount: 42 },
    { id: '2', name: 'Repairs', slug: 'repairs', icon: 'tool', serviceCount: 38 },
    { id: '3', name: 'Beauty', slug: 'beauty', icon: 'scissors', serviceCount: 25 },
    { id: '4', name: 'Personal Care', slug: 'personal-care', icon: 'heart', serviceCount: 18 },
    { id: '5', name: 'Gardening', slug: 'gardening', icon: 'flower', serviceCount: 15 },
    { id: '6', name: 'Electrical', slug: 'electrical', icon: 'zap', serviceCount: 22 },
    { id: '7', name: 'Plumbing', slug: 'plumbing', icon: 'droplet', serviceCount: 19 },
    { id: '8', name: 'Painting', slug: 'painting', icon: 'brush', serviceCount: 12 }
  ]

  console.log('🎯 useCategories - data:', data)
  console.log('🎯 useCategories - isLoading:', isLoading)
  console.log('🎯 useCategories - error:', error)
  console.log('🎯 useCategories - categories (final):', Array.isArray(data) ? data : mockCategories)

  return {
    categories: Array.isArray(data) ? data : mockCategories,
    isLoading,
    error,
    refetch
  }
} 