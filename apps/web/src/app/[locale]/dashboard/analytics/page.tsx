'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button' // Temporarily disabled
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  // MessageSquare, 
  Star, 
  Calendar,
  Users,
  DollarSign,
  Target,
  Clock
} from 'lucide-react'
import { usePlans } from '@/hooks/use-plans'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AnalyticsPage() {
  const t = useTranslations('dashboard.analytics')
  const [timeRange, setTimeRange] = useState('30d')
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { currentPlan, isLoading: planLoading } = usePlans()
  const isPro = currentPlan?.type === 'PRO'

  // Mock data - em produção seria obtido via API
  const stats = {
    totalViews: 1247,
    totalLeads: 89,
    totalBookings: 34,
    totalRevenue: 5420,
    averageRating: 4.8,
    responseTime: '2h 30min',
    conversionRate: 7.1,
    repeatCustomers: 23
  }

  const topServices = [
    { name: 'House Cleaning', views: 324, leads: 28, bookings: 12 },
    { name: 'Plumbing Repair', views: 298, leads: 25, bookings: 10 },
    { name: 'Electrical Work', views: 245, leads: 18, bookings: 8 },
    { name: 'Landscaping', views: 189, leads: 12, bookings: 6 }
  ]

  if (!isPro && !planLoading) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-yellow-50 border border-yellow-300 rounded-xl text-center shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">{t('subscriptionPage.upgradeBanner')}</h2>
        <p className="mb-4 text-yellow-800">{t('subscriptionPage.pro.features.0')}</p>
        <Button className="bg-amber-500 text-white font-bold hover:bg-amber-600" onClick={() => router.push(`/${locale}/dashboard/subscription`)}>
          {t('subscriptionPage.pro.cta')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t('timeRange.7d')}</SelectItem>
            <SelectItem value="30d">{t('timeRange.30d')}</SelectItem>
            <SelectItem value="90d">{t('timeRange.90d')}</SelectItem>
            <SelectItem value="1y">{t('timeRange.1y')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.totalViews')}</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% {t('metrics.fromLastMonth')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.totalLeads')}</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% {t('metrics.fromLastMonth')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.totalBookings')}</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% {t('metrics.fromLastMonth')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% {t('metrics.fromLastMonth')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.averageRating')}</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <div className="text-xs text-gray-500">{t('metrics.outOf5')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.responseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseTime}</div>
            <div className="text-xs text-gray-500">{t('metrics.averageResponse')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.conversionRate')}</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="text-xs text-gray-500">{t('metrics.leadsToBookings')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('metrics.repeatCustomers')}</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.repeatCustomers}</div>
            <div className="text-xs text-gray-500">{t('metrics.thisMonth')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="services">{t('tabs.services')}</TabsTrigger>
          <TabsTrigger value="customers">{t('tabs.customers')}</TabsTrigger>
          <TabsTrigger value="revenue">{t('tabs.revenue')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('charts.performanceOverview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                {t('charts.chartPlaceholder')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tables.topServices')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          {service.views} {t('tables.views')} • {service.leads} {t('tables.leads')} • {service.bookings} {t('tables.bookings')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{((service.bookings / service.leads) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">{t('tables.conversion')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tables.customerInsights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                {t('tables.comingSoon')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tables.revenueAnalysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                {t('tables.comingSoon')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 