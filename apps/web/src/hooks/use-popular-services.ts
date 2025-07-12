import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface PopularService {
  id: string
  title: string
  slug: string
  description: string
  price: number
  category: {
    id: string
    name: string
    slug: string
  }
  images: string[]
  rating: number
  reviewCount: number
  location: string
  isAvailable: boolean
  responseTime: string
  provider: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    verified: boolean
  }
}

export function usePopularServices() {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['popular-services'],
    queryFn: async () => {
      try {
        // Using the services endpoint with a filter for popular services
        const response = await apiClient.getServices({ 
          sort: 'popularity', 
          limit: 6,
          featured: true
        })
        return response.data.data || []
      } catch (err: any) {
        console.error('Error fetching popular services:', err)
        throw err
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fallback to mock data if API fails or during development
  const mockPopularServices: PopularService[] = [
    {
      id: '1',
      title: 'Professional House Cleaning',
      slug: 'professional-house-cleaning',
      description: 'Deep cleaning service for your home with eco-friendly products',
      price: 120,
      category: {
        id: '1',
        name: 'Cleaning',
        slug: 'cleaning'
      },
      images: ['/placeholder-service-1.jpg'],
      rating: 4.8,
      reviewCount: 124,
      location: 'Miami, FL',
      isAvailable: true,
      responseTime: '2 hours',
      provider: {
        id: '1',
        firstName: 'Maria',
        lastName: 'Silva',
        avatar: '/placeholder-avatar.jpg',
        verified: true
      }
    },
    {
      id: '2',
      title: 'Electrical Repairs',
      slug: 'electrical-repairs',
      description: 'Professional electrical services for residential and commercial properties',
      price: 85,
      category: {
        id: '6',
        name: 'Electrical',
        slug: 'electrical'
      },
      images: ['/placeholder-service-2.jpg'],
      rating: 4.9,
      reviewCount: 98,
      location: 'Orlando, FL',
      isAvailable: true,
      responseTime: '1 hour',
      provider: {
        id: '2',
        firstName: 'João',
        lastName: 'Santos',
        avatar: '/placeholder-avatar.jpg',
        verified: true
      }
    },
    {
      id: '3',
      title: 'Garden Maintenance',
      slug: 'garden-maintenance',
      description: 'Complete garden care including pruning, planting, and landscaping',
      price: 95,
      category: {
        id: '5',
        name: 'Gardening',
        slug: 'gardening'
      },
      images: ['/placeholder-service-3.jpg'],
      rating: 4.7,
      reviewCount: 86,
      location: 'Tampa, FL',
      isAvailable: true,
      responseTime: '3 hours',
      provider: {
        id: '3',
        firstName: 'Ana',
        lastName: 'Costa',
        avatar: '/placeholder-avatar.jpg',
        verified: true
      }
    }
  ]

  return {
    popularServices: data || mockPopularServices,
    isLoading,
    error,
    refetch
  }
} 