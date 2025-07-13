'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { 
  Megaphone, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Users,
  BarChart3,
  AlertTriangle,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
// import { useAuthStore } from '@/store/auth-store'
import { usePlans } from '@/hooks/use-plans'

export default function AdsPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('dashboard.ads')
  const tSubscription = useTranslations('subscriptionPage')
  // const { user } = useAuthStore() // Temporarily disabled
  const { currentPlan, isLoading: planLoading } = usePlans()
  const isPro = currentPlan?.type === 'PRO'

  // Mock data - em produção virá da API
  const adsStats = {
    totalSpent: 1245.50,
    totalImpressions: 15420,
    totalClicks: 892,
    totalLeads: 47,
    ctr: 5.8,
    cpc: 1.40,
    conversionRate: 5.3,
    roas: 3.2,
    activeCampaigns: 3,
    totalCampaigns: 5,
    budgetUsed: 68.5,
    budget: 1000 // Orçamento total mensal
  }

  const activeCampaigns = [
    {
      id: 1,
      name: 'Limpeza Residencial - Janeiro',
      type: 'FEATURED',
      status: 'ACTIVE',
      budget: 500,
      spent: 342.50,
      impressions: 4250,
      clicks: 298,
      leads: 18,
      ctr: 7.0,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      services: ['Limpeza Residencial', 'Limpeza Pós-Obra']
    },
    {
      id: 2,
      name: 'Boost Serviços Elétricos',
      type: 'BOOST',
      status: 'ACTIVE',
      budget: 300,
      spent: 189.25,
      impressions: 2890,
      clicks: 201,
      leads: 12,
      ctr: 6.9,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      services: ['Instalação Elétrica', 'Reparo Elétrico']
    },
    {
      id: 3,
      name: 'Top da Lista - Jardinagem',
      type: 'TOP_LIST',
      status: 'PAUSED',
      budget: 200,
      spent: 156.75,
      impressions: 1890,
      clicks: 134,
      leads: 8,
      ctr: 7.1,
      startDate: '2024-01-05',
      endDate: '2024-01-20',
      services: ['Jardinagem', 'Paisagismo']
    }
  ]

  const quickActions = [
    {
      title: t('quickActions.createCampaign'),
      description: t('quickActions.createCampaignDescription'),
      icon: Plus,
      action: () => router.push(`/${locale}/dashboard/ads/campaigns/create`),
      color: 'bg-blue-500'
    },
    {
      title: t('quickActions.boostService'),
      description: t('quickActions.boostServiceDescription'),
      icon: Zap,
      action: () => router.push(`/${locale}/dashboard/ads/boost`),
      color: 'bg-yellow-500'
    },
    {
      title: t('quickActions.viewAnalytics'),
      description: t('quickActions.viewAnalyticsDescription'),
      icon: BarChart3,
      action: () => router.push(`/${locale}/dashboard/ads/performance`),
      color: 'bg-green-500'
    },
    {
      title: t('quickActions.manageBudget'),
      description: t('quickActions.manageBudgetDescription'),
      icon: DollarSign,
      action: () => router.push(`/${locale}/dashboard/ads/budget`),
      color: 'bg-purple-500'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'ENDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FEATURED': return 'bg-purple-100 text-purple-800'
      case 'BOOST': return 'bg-blue-100 text-blue-800'
      case 'TOP_LIST': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isPro && !planLoading) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-yellow-50 border border-yellow-300 rounded-xl text-center shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">{tSubscription('upgradeBanner')}</h2>
        <p className="mb-4 text-yellow-800">{tSubscription('pro.features.0')}</p>
        <Button className="bg-amber-500 text-white font-bold hover:bg-amber-600" onClick={() => router.push(`/${locale}/dashboard/subscription`)}>
          {tSubscription('pro.cta')}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Megaphone className="mr-3 h-8 w-8 text-blue-600" />
              {t('title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/dashboard/ads/campaigns`)}
            >
              {/* Settings icon removed */}
              {t('manageCampaigns')}
            </Button>
            <Button
              onClick={() => router.push(`/${locale}/dashboard/ads/campaigns/create`)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('createCampaign')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalSpent')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${adsStats.totalSpent.toFixed(2)}</div>
            <div className="flex items-center mt-2">
              <Progress value={(adsStats.budgetUsed / adsStats.budget) * 100} className="flex-1 mr-2" />
              <span className="text-xs text-gray-500">
                {((adsStats.budgetUsed / adsStats.budget) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.impressions')}
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adsStats.totalImpressions.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12.5% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.clicks')}
            </CardTitle>
            <MousePointer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adsStats.totalClicks}</div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500">
                CTR: {adsStats.ctr}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.leads')}
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adsStats.totalLeads}</div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500">
                {t('stats.conversionRate')}: {adsStats.conversionRate}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('activeCampaigns')}</CardTitle>
                <CardDescription>
                  {t('activeCampaignsDescription')}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/${locale}/dashboard/ads/campaigns`)}
              >
                {t('viewAll')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{campaign.impressions.toLocaleString()}</span>
                        <br />
                        <span className="text-xs">Impressões</span>
                      </div>
                      <div>
                        <span className="font-medium">{campaign.clicks}</span>
                        <br />
                        <span className="text-xs">Cliques</span>
                      </div>
                      <div>
                        <span className="font-medium">{campaign.leads}</span>
                        <br />
                        <span className="text-xs">Leads</span>
                      </div>
                      <div>
                        <span className="font-medium">${campaign.spent.toFixed(2)}</span>
                        <br />
                        <span className="text-xs">Gasto</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.status === 'ACTIVE' ? (
                      <Button variant="outline" size="sm">
                        {/* Pause icon removed */}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        {/* Play icon removed */}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      {/* Settings icon removed */}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions.title')}</CardTitle>
            <CardDescription>
              {t('quickActions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center p-3 rounded-lg border hover:shadow-sm transition-shadow text-left"
              >
                <div className={`p-2 rounded-md ${action.color} mr-3`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('performanceSummary')}</CardTitle>
          <CardDescription>
            {t('performanceSummaryDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{adsStats.ctr}%</div>
              <div className="text-sm text-gray-600">Taxa de Cliques (CTR)</div>
              <div className="text-xs text-green-600 mt-1">
                +0.3% vs média da categoria
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${adsStats.cpc.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Custo por Clique (CPC)</div>
              <div className="text-xs text-green-600 mt-1">
                -$0.12 vs média da categoria
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{adsStats.conversionRate}%</div>
              <div className="text-sm text-gray-600">Taxa de Conversão</div>
              <div className="text-xs text-green-600 mt-1">
                +1.2% vs média da categoria
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Alert */}
      {(adsStats.budgetUsed / adsStats.budget) > 0.8 && (
        <Card className="mt-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="font-medium text-yellow-800">
                  {t('budgetAlert.title')}
                </p>
                <p className="text-sm text-yellow-700">
                  {t('budgetAlert.description', { 
                    percentage: ((adsStats.budgetUsed / adsStats.budget) * 100).toFixed(1) 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 