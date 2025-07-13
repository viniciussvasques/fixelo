import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
interface Campaign {
  id: string
  name: string
  serviceId: string
  adType: 'BOOST' | 'FEATURED' | 'TOP_LIST'
  status: 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT'
  budget: number
  budgetType: 'DAILY' | 'TOTAL'
  spent: number
  remaining: number
  impressions: number
  clicks: number
  leads: number
  ctr: number
  cpc: number
  conversionRate: number
  roas: number
  startDate: string
  endDate: string
  targeting: {
    cities: string[]
    categories: string[]
  }
  createdAt: string
  updatedAt: string
}

interface BoostRequest {
  serviceId: string
  duration: number
  budget: number
  targetCities: string
}

interface CreateCampaignRequest {
  serviceId: string
  name: string
  description?: string
  adType: 'BOOST' | 'FEATURED' | 'TOP_LIST'
  budget: number
  budgetType: 'DAILY' | 'TOTAL'
  startDate: string
  endDate: string
  targeting: {
    cities: string[]
    categories?: string[]
  }
  bidAmount?: number
  maxBid?: number
}

interface UpdateCampaignRequest {
  name?: string
  description?: string
  budget?: number
  budgetType?: 'DAILY' | 'TOTAL'
  startDate?: string
  endDate?: string
  targeting?: {
    cities: string[]
    categories?: string[]
  }
  bidAmount?: number
  maxBid?: number
}

interface BidRequest {
  bidAmount: number
  maxBid: number
}

interface LeadsPurchaseRequest {
  quantity: number
  paymentMethodId: string
}

interface UpgradePlanRequest {
  planType: 'PRO'
  billingPeriod: 'monthly' | 'yearly'
  paymentMethodId: string
}

interface AnalyticsParams {
  campaignId?: string
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month'
}

// Campaigns
export const useAdsCampaigns = (params?: { 
  status?: string
  adType?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['ads', 'campaigns', params],
    queryFn: async () => {
      const { data } = await api.get('/ads/campaigns', { params })
      return data
    }
  })
}

export const useAdsCampaign = (id: string) => {
  return useQuery({
    queryKey: ['ads', 'campaigns', id],
    queryFn: async () => {
      const { data } = await api.get(`/ads/campaigns/${id}`)
      return data
    },
    enabled: !!id
  })
}

export const useCreateAdsCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (campaignData: CreateCampaignRequest) => {
      const { data } = await api.post('/ads/campaigns', campaignData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    }
  })
}

export const useUpdateAdsCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCampaignRequest & { id: string }) => {
      const { data: response } = await api.patch(`/ads/campaigns/${id}`, data)
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    }
  })
}

export const useActivateAdsCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/ads/campaigns/${id}/activate`)
      return data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns', id] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    }
  })
}

export const usePauseAdsCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/ads/campaigns/${id}/pause`)
      return data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns', id] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    }
  })
}

export const useDeleteAdsCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/ads/campaigns/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    }
  })
}

// Boost
export const useCreateAdsBoost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (boostData: BoostRequest) => {
      const { data } = await api.post('/ads/boost', boostData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    }
  })
}

// Bidding
export const useCreateAdsBid = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ campaignId, ...bidData }: BidRequest & { campaignId: string }) => {
      const { data } = await api.post(`/ads/campaigns/${campaignId}/bid`, bidData)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns', variables.campaignId] })
    }
  })
}

// Analytics
export const useAdsAnalytics = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: ['ads', 'analytics', params],
    queryFn: async () => {
      const { data } = await api.get('/ads/analytics', { params })
      return data
    }
  })
}

export const useAdsStats = () => {
  return useQuery({
    queryKey: ['ads', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/ads/stats')
      return data
    }
  })
}

// Leads Purchase
export const usePurchaseLeads = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (purchaseData: LeadsPurchaseRequest) => {
      const { data } = await api.post('/ads/leads/purchase', purchaseData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'user', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'user', 'usage'] })
    }
  })
}

// Plan Upgrade
export const useUpgradePlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (upgradeData: UpgradePlanRequest) => {
      const { data } = await api.post('/ads/upgrade-plan', upgradeData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'user', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'user', 'usage'] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'user', 'limits'] })
    }
  })
}

// Admin Stats (for admin users)
export const useAdsAdminStats = () => {
  return useQuery({
    queryKey: ['ads', 'admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/ads/admin/stats')
      return data
    }
  })
}

// Combined hooks for dashboard
export const useAdsDashboard = () => {
  const stats = useAdsStats()
  const campaigns = useAdsCampaigns({ status: 'ACTIVE', limit: 5 })
  const analytics = useAdsAnalytics()
  
  return {
    stats,
    campaigns,
    analytics,
    isLoading: stats.isLoading || campaigns.isLoading || analytics.isLoading,
    error: stats.error || campaigns.error || analytics.error
  }
}

// Real-time monitoring
export const useAdsMonitoring = () => {
  const queryClient = useQueryClient()
  
  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] })
    queryClient.invalidateQueries({ queryKey: ['ads', 'campaigns'] })
    queryClient.invalidateQueries({ queryKey: ['ads', 'analytics'] })
  }
  
  return {
    refreshStats,
    refreshInterval: 30000 // 30 seconds
  }
}

// Budget alerts
export const useAdsBudgetAlerts = () => {
  const { data: campaigns } = useAdsCampaigns({ status: 'ACTIVE' })
  
  const alerts = campaigns?.filter((campaign: Campaign) => {
    const budgetUsage = (campaign.spent / campaign.budget) * 100
    return budgetUsage >= 80 // Alert when 80% or more of budget is used
  }) || []
  
  return {
    alerts,
    hasAlerts: alerts.length > 0,
    criticalAlerts: alerts.filter((campaign: Campaign) => {
      const budgetUsage = (campaign.spent / campaign.budget) * 100
      return budgetUsage >= 95 // Critical when 95% or more is used
    })
  }
} 