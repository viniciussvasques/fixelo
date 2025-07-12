'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Crown, Zap, Star, TrendingUp } from 'lucide-react'
import { CurrentPlan } from '@/components/ui/current-plan'
import { UpgradeModal } from '@/components/ui/upgrade-modal'
import { usePlans } from '@/hooks/use-plans'

export default function SubscriptionPage() {
  const t = useTranslations('dashboard.subscription')
  const { currentPlan, usage, limits, isLoading } = usePlans()

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Badge variant="outline" className="text-sm">
          {t('currentPlan', { plan: currentPlan?.name || 'Free' })}
        </Badge>
      </div>

      {/* Current Plan Status */}
      <CurrentPlan 
        plan={currentPlan}
        usage={usage}
        limits={limits}
      />

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              {t('plans.free.name')}
            </CardTitle>
            <div className="text-3xl font-bold">
              {t('plans.free.price')}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                t('plans.free.features.basicListing'),
                t('plans.free.features.limitedLeads'),
                t('plans.free.features.basicSupport'),
                t('plans.free.features.basicAnalytics')
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={currentPlan?.name === 'FREE'}
            >
              {currentPlan?.name === 'FREE' ? t('plans.current') : t('plans.downgrade')}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-blue-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-500 text-white">
              {t('plans.popular')}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              {t('plans.pro.name')}
            </CardTitle>
            <div className="text-3xl font-bold">
              {t('plans.pro.price')}
              <span className="text-sm text-gray-500 font-normal">/{t('plans.month')}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                t('plans.pro.features.priorityListing'),
                t('plans.pro.features.unlimitedLeads'),
                t('plans.pro.features.advancedAnalytics'),
                t('plans.pro.features.prioritySupport'),
                t('plans.pro.features.customBranding')
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <UpgradeModal 
              planType="PRO"
              currentPlan={currentPlan?.name || 'FREE'}
            >
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                {currentPlan?.name === 'PRO' ? t('plans.current') : t('plans.upgrade')}
              </Button>
            </UpgradeModal>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              {t('plans.premium.name')}
            </CardTitle>
            <div className="text-3xl font-bold">
              {t('plans.premium.price')}
              <span className="text-sm text-gray-500 font-normal">/{t('plans.month')}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                t('plans.premium.features.topListing'),
                t('plans.premium.features.unlimitedEverything'),
                t('plans.premium.features.dedicatedManager'),
                t('plans.premium.features.customIntegrations'),
                t('plans.premium.features.whiteLabel')
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <UpgradeModal 
              planType="PREMIUM"
              currentPlan={currentPlan?.name || 'FREE'}
            >
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                {currentPlan?.name === 'PREMIUM' ? t('plans.current') : t('plans.upgrade')}
              </Button>
            </UpgradeModal>
          </CardContent>
        </Card>
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