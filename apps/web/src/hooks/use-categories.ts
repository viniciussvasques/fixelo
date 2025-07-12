import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

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
        const response = await apiClient.getCategories()
        return response.data.data || []
      } catch (err: any) {
        console.error('Error fetching categories:', err)
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

  return {
    categories: data || mockCategories,
    isLoading,
    error,
    refetch
  }
} 