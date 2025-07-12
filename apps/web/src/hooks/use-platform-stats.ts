// import { useQuery } from '@tanstack/react-query'
// import { apiClient } from '@/lib/api'

interface PlatformStats {
  servicesCompleted: number
  verifiedProfessionals: number
  citiesCount: number
  averageRating: number
}

export function usePlatformStats() {
  // Mock data for public display - the API endpoint is protected and should only be used by admins
  const mockStats: PlatformStats = {
    servicesCompleted: 50432,
    verifiedProfessionals: 10256,
    citiesCount: 25,
    averageRating: 4.9
  }

  // For now, always return mock data since the API endpoint is protected
  // In the future, we could create a public stats endpoint for the landing page
  return {
    stats: mockStats,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve()
  }
} 