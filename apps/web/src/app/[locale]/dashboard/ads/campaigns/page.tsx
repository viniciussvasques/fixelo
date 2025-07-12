'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { 
  Target, 
  Plus, 
  Search, 
  MoreHorizontal,
  Play,
  Pause,
  Settings,
  Trash2,
  Copy,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Eye,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'

export default function CampaignsPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('dashboard.ads.campaigns')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data - em produção virá da API
  const campaigns = [
    {
      id: 1,
      name: 'Limpeza Residencial - Janeiro',
      type: 'FEATURED',
      status: 'ACTIVE',
      budget: 500,
      spent: 342.50,
      remaining: 157.50,
      impressions: 4250,
      clicks: 298,
      leads: 18,
      ctr: 7.0,
      cpc: 1.15,
      conversionRate: 6.0,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      services: ['Limpeza Residencial', 'Limpeza Pós-Obra'],
      targetCities: ['São Paulo', 'Rio de Janeiro'],
      dailyBudget: 16.13,
      performance: 'good'
    },
    {
      id: 2,
      name: 'Boost Serviços Elétricos',
      type: 'BOOST',
      status: 'ACTIVE',
      budget: 300,
      spent: 189.25,
      remaining: 110.75,
      impressions: 2890,
      clicks: 201,
      leads: 12,
      ctr: 6.9,
      cpc: 0.94,
      conversionRate: 5.9,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      services: ['Instalação Elétrica', 'Reparo Elétrico'],
      targetCities: ['São Paulo'],
      dailyBudget: 20.00,
      performance: 'excellent'
    },
    {
      id: 3,
      name: 'Top da Lista - Jardinagem',
      type: 'TOP_LIST',
      status: 'PAUSED',
      budget: 200,
      spent: 156.75,
      remaining: 43.25,
      impressions: 1890,
      clicks: 134,
      leads: 8,
      ctr: 7.1,
      cpc: 1.17,
      conversionRate: 5.9,
      startDate: '2024-01-05',
      endDate: '2024-01-20',
      services: ['Jardinagem', 'Paisagismo'],
      targetCities: ['São Paulo', 'Campinas'],
      dailyBudget: 13.33,
      performance: 'poor'
    },
    {
      id: 4,
      name: 'Campanha Pintura Residencial',
      type: 'FEATURED',
      status: 'ENDED',
      budget: 400,
      spent: 400,
      remaining: 0,
      impressions: 3200,
      clicks: 245,
      leads: 15,
      ctr: 7.7,
      cpc: 1.63,
      conversionRate: 6.1,
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      services: ['Pintura Residencial', 'Pintura Comercial'],
      targetCities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
      dailyBudget: 12.90,
      performance: 'good'
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

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'poor': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || campaign.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const totalStats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads, 0)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Target className="mr-3 h-8 w-8 text-blue-600" />
              {t('title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('subtitle')}
            </p>
          </div>
          <Button
            onClick={() => router.push(`/${locale}/dashboard/ads/campaigns/create`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('createCampaign')}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalCampaigns')}
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalCampaigns}</div>
            <p className="text-xs text-gray-500">
              {totalStats.activeCampaigns} {t('stats.active')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalBudget')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.totalBudget}</div>
            <p className="text-xs text-gray-500">
              ${totalStats.totalSpent} {t('stats.spent')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalImpressions')}
            </CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {totalStats.totalClicks} {t('stats.clicks')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalLeads')}
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalLeads}</div>
            <p className="text-xs text-gray-500">
              {((totalStats.totalLeads / totalStats.totalClicks) * 100).toFixed(1)}% {t('stats.conversionRate')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('filters.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                {t('filters.all')}
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                {t('filters.active')}
              </Button>
              <Button
                variant={filterStatus === 'paused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('paused')}
              >
                {t('filters.paused')}
              </Button>
              <Button
                variant={filterStatus === 'ended' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ended')}
              >
                {t('filters.ended')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('campaignsList')}</CardTitle>
          <CardDescription>
            {t('campaignsListDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(campaign.type)}>
                          {campaign.type}
                        </Badge>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        {getPerformanceIcon(campaign.performance)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.status === 'ACTIVE' ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : campaign.status === 'PAUSED' ? (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          {t('actions.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          {t('actions.duplicate')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('actions.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {campaign.impressions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Impressões</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {campaign.clicks}
                    </div>
                    <div className="text-sm text-gray-500">Cliques</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {campaign.leads}
                    </div>
                    <div className="text-sm text-gray-500">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      ${campaign.spent.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">Gasto</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Orçamento</span>
                      <span>${campaign.spent.toFixed(2)} / ${campaign.budget}</span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">CTR</div>
                    <div className="font-semibold">{campaign.ctr}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">CPC</div>
                    <div className="font-semibold">${campaign.cpc.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                    <div>
                      Cidades: {campaign.targetCities.join(', ')}
                    </div>
                  </div>
                  <div>
                    Orçamento diário: ${campaign.dailyBudget.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 