'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdsCampaigns, useCreateAdsCampaign } from '@/hooks/use-ads'
import { useServices } from '@/hooks/use-services'

export default function TestPage() {
  const t = useTranslations('dashboard.ads')
  const tCampaigns = useTranslations('dashboard.ads.campaigns')
  const tCreate = useTranslations('dashboard.ads.campaigns.create')
  
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useAdsCampaigns()
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices({ providerId: 'current' })
  const createCampaign = useCreateAdsCampaign()

  const handleTestCampaign = async () => {
    try {
      await createCampaign.mutateAsync({
        name: 'Test Campaign',
        description: 'Test campaign description',
        serviceId: 'test-service-id',
        adType: 'BOOST',
        budget: 100,
        budgetType: 'DAILY',
        startDate: '2024-01-15',
        endDate: '2024-01-30',
        targeting: {
          cities: ['São Paulo', 'Rio de Janeiro']
        }
      })
      console.log('Campaign created successfully!')
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Teste de Traduções e APIs</h1>
      
      {/* Teste de Traduções */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de Traduções</CardTitle>
          <CardDescription>Verificando se as traduções estão funcionando</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>dashboard.ads.title:</strong> {t('title')}
          </div>
          <div>
            <strong>dashboard.ads.subtitle:</strong> {t('subtitle')}
          </div>
          <div>
            <strong>dashboard.ads.campaigns.title:</strong> {tCampaigns('title')}
          </div>
          <div>
            <strong>dashboard.ads.campaigns.create.title:</strong> {tCreate('title')}
          </div>
          <div>
            <strong>dashboard.ads.campaigns.create.campaignName:</strong> {tCreate('campaignName')}
          </div>
        </CardContent>
      </Card>

      {/* Teste de API - Campanhas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de API - Campanhas</CardTitle>
          <CardDescription>Verificando se a API de campanhas está funcionando</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Status:</strong> {campaignsLoading ? 'Carregando...' : campaignsError ? 'Erro' : 'Sucesso'}
          </div>
          {campaignsError && (
            <div className="text-red-600">
              <strong>Erro:</strong> {campaignsError.message}
            </div>
          )}
          {campaigns && (
            <div>
              <strong>Campanhas:</strong> {JSON.stringify(campaigns, null, 2)}
            </div>
          )}
          <Button onClick={handleTestCampaign} disabled={createCampaign.isPending}>
            {createCampaign.isPending ? 'Criando...' : 'Testar Criação de Campanha'}
          </Button>
        </CardContent>
      </Card>

      {/* Teste de API - Serviços */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de API - Serviços</CardTitle>
          <CardDescription>Verificando se a API de serviços está funcionando</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Status:</strong> {servicesLoading ? 'Carregando...' : servicesError ? 'Erro' : 'Sucesso'}
          </div>
          {servicesError && (
            <div className="text-red-600">
              <strong>Erro:</strong> {servicesError.message}
            </div>
          )}
          {services && (
            <div>
              <strong>Serviços:</strong> {JSON.stringify(services, null, 2)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 