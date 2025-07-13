import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

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
  const { data: currentPlanRaw, isLoading: currentPlanLoading } = useQuery({
    queryKey: ['plans', 'current'],
    queryFn: async () => {
      const { data } = await api.get('/plans/user/current')
      return data
    }
  })

  // Mapear a resposta da API para o formato esperado
  const currentPlan = currentPlanRaw ? {
    type: currentPlanRaw.type || currentPlanRaw.currentPlan, // 'FREE' ou 'PRO'
    name: currentPlanRaw.details?.name?.pt || currentPlanRaw.details?.name?.en || currentPlanRaw.currentPlan,
    features: currentPlanRaw.details?.features?.pt || currentPlanRaw.details?.features?.en || [],
    ...currentPlanRaw.details
  } : undefined

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