'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { 
  ArrowLeft,
  Target, 
  DollarSign,
  MapPin,
  Settings,
  Eye,
  Save,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useCreateAdsCampaign } from '@/hooks/use-ads'
import { useServices } from '@/hooks/use-services'
import { useFloridaCities } from '@/hooks/use-cities'
import { useAuthStore } from '@/store/auth-store'

export default function CreateCampaignPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('dashboard.ads.campaigns.create')
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  // Buscar serviços do provedor atual
  const { data: services = [] } = useServices({ providerId: 'current' })
  const { cities, isLoading: citiesLoading } = useFloridaCities()
  const createCampaign = useCreateAdsCampaign()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceId: '',
    adType: '',
    budget: '',
    budgetType: 'DAILY',
    startDate: '',
    endDate: '',
    targetCities: [] as string[],
    autoRenew: false,
    bidAmount: '',
    maxBid: ''
  })

  // Verificar se usuário está autenticado
  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você precisa estar logado para criar campanhas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(`/${locale}/auth`)}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verificar se é um provedor
  if (user.role !== 'PROVIDER') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Apenas provedores podem criar campanhas de anúncios.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCityToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      targetCities: prev.targetCities.includes(city)
        ? prev.targetCities.filter(c => c !== city)
        : [...prev.targetCities, city]
    }))
  }

  const calculateEstimatedCost = () => {
    const budget = parseFloat(formData.budget) || 0
    const days = formData.startDate && formData.endDate 
      ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24))
      : 1
    
    if (formData.budgetType === 'DAILY') {
      return budget * days
    }
    return budget
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validações
      if (!formData.name || !formData.serviceId || !formData.adType || !formData.budget) {
        toast({
          title: t('validationError'),
          description: t('fillRequiredFields'),
          variant: "destructive"
        })
        return
      }

      if (formData.targetCities.length === 0) {
        toast({
          title: t('validationError'),
          description: t('selectCities'),
          variant: "destructive"
        })
        return
      }

      // Preparar dados para API
      const campaignData = {
        name: formData.name,
        description: formData.description,
        serviceId: formData.serviceId,
        adType: formData.adType as 'BOOST' | 'FEATURED' | 'TOP_LIST',
        budget: parseFloat(formData.budget),
        budgetType: formData.budgetType as 'DAILY' | 'TOTAL',
        startDate: formData.startDate,
        endDate: formData.endDate,
        targeting: {
          cities: formData.targetCities
        },
        ...(formData.bidAmount && { bidAmount: parseFloat(formData.bidAmount) }),
        ...(formData.maxBid && { maxBid: parseFloat(formData.maxBid) })
      }

      await createCampaign.mutateAsync(campaignData)

      toast({
        title: t('campaignCreated'),
        description: t('campaignCreatedDescription'),
      })

      router.push(`/${locale}/dashboard/ads/campaigns`)
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorCreatingCampaign'),
        variant: "destructive"
      })
    }
  }

  const handleSaveDraft = async () => {
    // TODO: Implementar salvamento de rascunho
    toast({
      title: t('draftSaved'),
      description: t('draftSavedDescription'),
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Target className="mr-3 h-8 w-8 text-blue-600" />
                {t('title')}
              </h1>
            </div>
            <p className="text-gray-600">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              {t('basicInfo')}
            </CardTitle>
            <CardDescription>
              {t('basicInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t('campaignName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('campaignNamePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="serviceId">{t('service')} *</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => handleInputChange('serviceId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectService')} />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((service: any) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adType">{t('adType')} *</Label>
              <Select
                value={formData.adType}
                onValueChange={(value) => handleInputChange('adType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectAdType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEATURED">
                    <div>
                      <div className="font-medium">{t('adTypes.featured')}</div>
                      <div className="text-sm text-gray-500">{t('adTypes.featuredDescription')}</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="BOOST">
                    <div>
                      <div className="font-medium">{t('adTypes.boost')}</div>
                      <div className="text-sm text-gray-500">{t('adTypes.boostDescription')}</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="TOP_LIST">
                    <div>
                      <div className="font-medium">{t('adTypes.topList')}</div>
                      <div className="text-sm text-gray-500">{t('adTypes.topListDescription')}</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orçamento e Período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              {t('budgetAndPeriod')}
            </CardTitle>
            <CardDescription>
              {t('budgetAndPeriodDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">{t('budget')} *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="budgetType">{t('budgetType')}</Label>
                <Select
                  value={formData.budgetType}
                  onValueChange={(value) => handleInputChange('budgetType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">{t('daily')}</SelectItem>
                    <SelectItem value="TOTAL">{t('total')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">{t('startDate')} *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">{t('endDate')} *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={formData.autoRenew}
                onCheckedChange={(checked) => handleInputChange('autoRenew', checked)}
              />
              <Label htmlFor="autoRenew">{t('autoRenew')}</Label>
            </div>
          </CardContent>
        </Card>

        {/* Segmentação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              {t('targeting')}
            </CardTitle>
            <CardDescription>
              {t('targetingDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('targetCities')} *</Label>
              <div className="mt-2 space-y-2">
                {citiesLoading ? (
                  <div>Carregando cidades...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {cities.map((city) => (
                      <div
                        key={city}
                        className={`p-2 border rounded cursor-pointer transition-colors ${
                          formData.targetCities.includes(city)
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleCityToggle(city)}
                      >
                        <div className="text-sm font-medium">{city}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formData.targetCities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.targetCities.map((city) => (
                    <Badge key={city} variant="secondary" className="text-xs">
                      {city}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estratégia de Lances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              {t('biddingStrategy')}
            </CardTitle>
            <CardDescription>
              {t('biddingStrategyDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bidAmount">{t('initialBid')}</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  value={formData.bidAmount}
                  onChange={(e) => handleInputChange('bidAmount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="maxBid">{t('maxBid')}</Label>
                <Input
                  id="maxBid"
                  type="number"
                  value={formData.maxBid}
                  onChange={(e) => handleInputChange('maxBid', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Campanha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              {t('campaignSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">{t('estimatedTotalCost')}</div>
                <div className="text-2xl font-bold">${calculateEstimatedCost().toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">{t('selectedCities')}</div>
                <div className="text-lg font-semibold">
                  {formData.targetCities.length} {t('citiesCount')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-between">
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {t('saveDraft')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t('cancel')}
            </Button>
          </div>
          <Button
            type="submit"
            disabled={createCampaign.isPending}
            className="flex items-center"
          >
            <Play className="mr-2 h-4 w-4" />
            {createCampaign.isPending ? t('creating') : t('createCampaign')}
          </Button>
        </div>
      </form>
    </div>
  )
} 