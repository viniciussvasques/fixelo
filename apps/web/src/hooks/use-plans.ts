import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  type: 'FREE' | 'PRO' | 'PREMIUM'
}

interface Usage {
  leadsUsed: number
  servicesActive: number
  bookingsThisMonth: number
  rating: number
}

interface Limits {
  maxLeads: number
  maxServices: number
  maxBookings: number
}

export const usePlans = () => {
  const { data: currentPlan, isLoading: currentPlanLoading } = useQuery({
    queryKey: ['plans', 'current'],
    queryFn: async () => {
      const { data } = await api.get<Plan>('/plans/user/current')
      return data
    }
  })

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['plans', 'usage'],
    queryFn: async () => {
      const { data } = await api.get<Usage>('/plans/user/usage')
      return data
    }
  })

  const { data: limits, isLoading: limitsLoading } = useQuery({
    queryKey: ['plans', 'limits'],
    queryFn: async () => {
      const { data } = await api.get<Limits>('/plans/user/limits')
      return data
    }
  })

  return {
    currentPlan,
    usage,
    limits,
    isLoading: currentPlanLoading || usageLoading || limitsLoading
  }
} 