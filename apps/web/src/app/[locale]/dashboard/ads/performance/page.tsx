'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Users, 
  DollarSign,
  BarChart3,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb
} from 'lucide-react';

export default function PerformancePage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [timeRange, setTimeRange] = useState('last30Days');

  // Mock analytics data
  const overallStats = {
    totalSpent: 1247.50,
    totalImpressions: 45680,
    totalClicks: 1892,
    totalLeads: 127,
    avgCtr: 4.14,
    avgCpc: 0.66,
    avgConversionRate: 6.71,
    avgRoas: 3.2,
    trends: {
      totalSpent: 12.5,
      totalImpressions: 8.3,
      totalClicks: -2.1,
      totalLeads: 15.4,
      avgCtr: -0.8,
      avgCpc: 5.2,
      avgConversionRate: 3.1,
      avgRoas: 8.7
    }
  };

  const campaignPerformance = [
    {
      id: '1',
      name: 'Limpeza Premium - Miami',
      impressions: 12450,
      clicks: 520,
      leads: 34,
      spent: 342.50,
      ctr: 4.18,
      cpc: 0.66,
      roas: 4.2,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Jardinagem Express - Orlando',
      impressions: 8920,
      clicks: 312,
      leads: 18,
      spent: 205.80,
      ctr: 3.50,
      cpc: 0.66,
      roas: 2.8,
      trend: 'down'
    },
    {
      id: '3',
      name: 'Elétrica Residencial - Tampa',
      impressions: 15230,
      clicks: 689,
      leads: 42,
      spent: 455.20,
      ctr: 4.52,
      cpc: 0.66,
      roas: 3.6,
      trend: 'up'
    },
    {
      id: '4',
      name: 'Pintura Profissional - Miami',
      impressions: 9080,
      clicks: 371,
      leads: 33,
      spent: 244.00,
      ctr: 4.08,
      cpc: 0.66,
      roas: 5.1,
      trend: 'up'
    }
  ];

  const topServices = [
    {
      serviceName: 'Limpeza Residencial Completa',
      category: 'Limpeza',
      impressions: 18750,
      clicks: 892,
      leads: 67,
      roas: 4.8,
      performanceScore: 95
    },
    {
      serviceName: 'Instalação Elétrica',
      category: 'Elétrica',
      impressions: 15230,
      clicks: 689,
      leads: 42,
      roas: 3.6,
      performanceScore: 82
    },
    {
      serviceName: 'Jardinagem e Paisagismo',
      category: 'Jardinagem',
      impressions: 12450,
      clicks: 520,
      leads: 34,
      roas: 2.8,
      performanceScore: 74
    },
    {
      serviceName: 'Pintura Residencial',
      category: 'Pintura',
      impressions: 9080,
      clicks: 371,
      leads: 33,
      roas: 5.1,
      performanceScore: 88
    }
  ];

  const insights = [
    {
      type: 'success' as const,
      title: 'Excelente Performance',
      description: 'Sua campanha &quot;Limpeza Premium&quot; está superando a média do setor em 40%',
      action: 'Considere aumentar o orçamento'
    },
    {
      type: 'warning' as const,
      title: 'Otimização Necessária',
      description: 'CTR da campanha &quot;Jardinagem Express&quot; está abaixo da média',
      action: 'Revisar palavras-chave e anúncios'
    },
    {
      type: 'info' as const,
      title: 'Oportunidade de Expansão',
      description: 'Considere expandir para Fort Lauderdale baseado no sucesso em Miami',
      action: 'Criar nova campanha'
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (value: number) => {
    return value > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { label: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Bom', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Regular', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Precisa Melhorar', color: 'bg-red-100 text-red-800' };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('ads.performance.title')}</h1>
          <p className="text-gray-600 mt-1">{t('ads.performance.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7Days">{t('ads.performance.last7Days')}</SelectItem>
              <SelectItem value="last30Days">{t('ads.performance.last30Days')}</SelectItem>
              <SelectItem value="last90Days">{t('ads.performance.last90Days')}</SelectItem>
              <SelectItem value="thisYear">{t('ads.performance.thisYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('ads.performance.exportReport')}
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ads.performance.totalSpent')}</p>
                <p className="text-2xl font-bold">${overallStats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className={`text-sm ${getTrendColor(overallStats.trends.totalSpent)}`}>
                  {overallStats.trends.totalSpent > 0 ? '+' : ''}{overallStats.trends.totalSpent}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ads.performance.totalImpressions')}</p>
                <p className="text-2xl font-bold">{overallStats.totalImpressions.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className={`text-sm ${getTrendColor(overallStats.trends.totalImpressions)}`}>
                  {overallStats.trends.totalImpressions > 0 ? '+' : ''}{overallStats.trends.totalImpressions}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ads.performance.totalClicks')}</p>
                <p className="text-2xl font-bold">{overallStats.totalClicks.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <MousePointer className="h-4 w-4 text-purple-600" />
                <span className={`text-sm ${getTrendColor(overallStats.trends.totalClicks)}`}>
                  {overallStats.trends.totalClicks > 0 ? '+' : ''}{overallStats.trends.totalClicks}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('ads.performance.totalLeads')}</p>
                <p className="text-2xl font-bold">{overallStats.totalLeads.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-orange-600" />
                <span className={`text-sm ${getTrendColor(overallStats.trends.totalLeads)}`}>
                  {overallStats.trends.totalLeads > 0 ? '+' : ''}{overallStats.trends.totalLeads}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">{t('ads.performance.campaigns')}</TabsTrigger>
          <TabsTrigger value="services">{t('ads.performance.services')}</TabsTrigger>
          <TabsTrigger value="insights">{t('ads.performance.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                {t('ads.performance.campaignPerformance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(campaign.trend)}
                        <span className="text-sm text-gray-500">
                          ROAS: {campaign.roas}x
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Impressões</p>
                        <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cliques</p>
                        <p className="font-medium">{campaign.clicks}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Leads</p>
                        <p className="font-medium">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gasto</p>
                        <p className="font-medium">${campaign.spent}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CTR</p>
                        <p className="font-medium">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CPC</p>
                        <p className="font-medium">${campaign.cpc}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ROAS</p>
                        <p className="font-medium">{campaign.roas}x</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {t('ads.performance.topServices')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{service.serviceName}</h3>
                        <p className="text-sm text-gray-600">{service.category}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={getPerformanceBadge(service.performanceScore).color}
                      >
                        {getPerformanceBadge(service.performanceScore).label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Impressões</p>
                        <p className="font-medium">{service.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cliques</p>
                        <p className="font-medium">{service.clicks}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Leads</p>
                        <p className="font-medium">{service.leads}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ROAS</p>
                        <p className="font-medium">{service.roas}x</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                {t('ads.performance.insights')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <Button variant="outline" size="sm">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 