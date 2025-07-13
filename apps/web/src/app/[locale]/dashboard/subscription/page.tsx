'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Crown, Zap, Star, TrendingUp } from 'lucide-react'
import { CurrentPlan } from '@/components/ui/current-plan'
import { usePlans } from '@/hooks/use-plans'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

export default function SubscriptionPage() {
  const t = useTranslations('subscriptionPage')
  const { currentPlan, usage, isLoading } = usePlans()
  const [isUpgrading, setIsUpgrading] = React.useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (searchParams.get('success') === '1') {
      // Atualiza plano instantaneamente após retorno do Stripe
      queryClient.invalidateQueries({ queryKey: ['plans', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'usage'] })
      // Remove o parâmetro da URL
      router.replace('/dashboard/subscription')
    }
  }, [searchParams, queryClient, router])

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true)
    try {
      // Chama endpoint que retorna a URL do Stripe Checkout
      const res = await api.post('/plans/checkout-session', { billingPeriod: 'monthly' })
      console.log('Checkout response:', res.data) // Debug log
      if (res.data?.data?.url) {
        window.location.href = res.data.data.url
        return
      }
      alert('Erro ao criar sessão de pagamento. Tente novamente.')
    } catch (error) {
      alert('Erro ao iniciar upgrade. Tente novamente.')
      console.error('Erro ao criar sessão Stripe:', error)
    } finally {
      setIsUpgrading(false)
    }
  }

  // TEMPORÁRIO: Simular sucesso do pagamento (apenas para desenvolvimento)
  const updateUserPlan = useAuthStore((state) => state.updateUserPlan)
  
  const handleSimulatePaymentSuccess = async () => {
    setIsUpgrading(true)
    try {
      const res = await api.post('/plans/simulate-payment-success')
      console.log('Payment simulation response:', res.data)
      
      if (res.data?.success) {
        // Atualizar o plano no AuthStore
        updateUserPlan('PRO', res.data.planExpiresAt)
        
        // Recarregar os dados do usuário
        await queryClient.invalidateQueries({ queryKey: ['userProfile'] })
        await queryClient.invalidateQueries({ queryKey: ['userPlan'] })
        await queryClient.invalidateQueries({ queryKey: ['plans'] })
        await queryClient.invalidateQueries({ queryKey: ['plans', 'current'] })
        await queryClient.invalidateQueries({ queryKey: ['plans', 'usage'] })
        await queryClient.invalidateQueries({ queryKey: ['plans', 'limits'] })
        
        // Redirecionar para o dashboard principal
        router.push('/dashboard')
      }
    } catch (error) {
      alert('❌ Erro ao simular pagamento. Tente novamente.')
      console.error('Erro ao simular pagamento:', error)
    } finally {
      setIsUpgrading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Badge variant="outline" className="text-sm">
          {t('currentPlan')}: {currentPlan?.name === 'PRO' ? t('pro.name') : t('free.name')}
        </Badge>
      </div>

      {/* Current Plan Status */}
      {currentPlan && (
        <CurrentPlan 
          plan={currentPlan}
        />
      )}

      {/* Plan Comparison */}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Free Plan Card */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                {t('free.name')}
              </CardTitle>
              <div className="text-3xl font-bold">
                {t('free.price')}
                <span className="text-sm text-gray-500 font-normal">/{t('month')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {t.raw('free.features').map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {t.raw('free.limitations').map((lim: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 opacity-60">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <span className="text-xs">{lim}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={currentPlan?.type === 'FREE'}
              >
                {t('free.cta')}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan Card */}
          <Card className="border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                {t('pro.name')}
                <Badge variant="secondary" className="ml-2">Popular</Badge>
              </CardTitle>
              <div className="text-3xl font-bold">
                {t('pro.price')}
                <span className="text-sm text-gray-500 font-normal">/{t('month')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {t.raw('pro.features').map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={currentPlan?.type === 'PRO' || isUpgrading}
                onClick={handleUpgradeToPro}
              >
                {isUpgrading ? 'Processando...' : t('pro.cta')}
              </Button>
              
              {/* BOTÃO TEMPORÁRIO PARA DESENVOLVIMENTO */}
              {process.env.NODE_ENV === 'development' && currentPlan?.type !== 'PRO' && (
                <Button 
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                  disabled={isUpgrading}
                  onClick={handleSimulatePaymentSuccess}
                >
                  🔧 Simular Pagamento (DEV)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            {t('usage.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {usage?.leadsUsed || 0}
              </div>
              <div className="text-sm text-gray-500">
                {t('usage.leadsUsed')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {usage?.servicesActive || 0}
              </div>
              <div className="text-sm text-gray-500">
                {t('usage.activeServices')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {usage?.bookingsThisMonth || 0}
              </div>
              <div className="text-sm text-gray-500">
                {t('usage.bookingsThisMonth')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {usage?.rating || '0.0'}
              </div>
              <div className="text-sm text-gray-500">
                {t('usage.averageRating')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 