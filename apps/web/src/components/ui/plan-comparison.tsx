'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/solid';

interface PlanComparisonProps {
  currentPlan?: 'FREE' | 'PREMIUM';
  showUpgrade?: boolean;
  compact?: boolean;
  onUpgrade?: () => void;
}

export function PlanComparison({ 
  currentPlan = 'FREE', 
  compact = false,
  onUpgrade 
}: PlanComparisonProps) {
  const t = useTranslations('plans');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Redirect to upgrade page
      window.location.href = '/dashboard/upgrade';
    }
  };

  const premiumPrice = billingPeriod === 'annual' ? 27.84 : 34.80; // 20% discount for annual
  const premiumSavings = billingPeriod === 'annual' ? '$167.04' : '$180';

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <StarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{t('benefits.moreLeads.title')}</p>
              <p className="text-sm text-gray-600">{t('benefits.moreLeads.description')}</p>
            </div>
          </div>
          <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
            {t('premium.button')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('upgrade.monthlyBilling')}
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingPeriod === 'annual' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingPeriod === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('upgrade.annualBilling')}
            </span>
            {billingPeriod === 'annual' && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                {t('upgrade.save20')}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE Plan */}
          <Card className="relative p-8 bg-white border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('free.name')}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{t('free.price')}</span>
                <span className="text-gray-600 ml-2">{t('free.period')}</span>
              </div>
              <p className="text-gray-600">{t('free.description')}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">{t('free.includes')}:</h4>
                <ul className="space-y-2">
                  {[
                    t('free.features.leadsPerWeek'),
                    t('free.features.basicProfile'),
                    t('free.features.images'),
                    t('free.features.standardSupport'),
                    t('free.features.basicAnalytics')
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">{t('free.limitations.title')}:</h4>
                <ul className="space-y-2">
                  {[
                    t('free.limitations.noTopPriority'),
                    t('free.limitations.noAds'),
                    t('free.limitations.limitedVisibility'),
                    t('free.limitations.slowVerification')
                  ].map((limitation, index) => (
                    <li key={index} className="flex items-center">
                      <XMarkIcon className="h-4 w-4 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              disabled={currentPlan === 'FREE'}
            >
              {currentPlan === 'FREE' ? t('free.button') : t('free.downgrade')}
            </Button>
          </Card>

          {/* PREMIUM Plan */}
          <Card className="relative p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                {t('premium.mostPopular')}
              </Badge>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('premium.name')}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">${premiumPrice}</span>
                <span className="text-gray-600 ml-2">{t('premium.period')}</span>
                {billingPeriod === 'annual' && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    {t('upgrade.savePerYear', { amount: premiumSavings })}
                  </div>
                )}
              </div>
              <p className="text-gray-600">{t('premium.description')}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">{t('premium.everythingInFree')}:</h4>
                <ul className="space-y-2">
                  {[
                    t('premium.features.moreLeads'),
                    t('premium.features.topList'),
                    t('premium.features.fullAds'),
                    t('premium.features.moreImages'),
                    t('premium.features.premiumBadge'),
                    t('premium.features.prioritySupport'),
                    t('premium.features.advancedAnalytics'),
                    t('premium.features.autoTemplates'),
                    t('premium.features.fastVerification'),
                    t('premium.features.competitorInsights')
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              disabled={currentPlan === 'PREMIUM'}
            >
              {currentPlan === 'PREMIUM' ? t('premium.currentPlan') : t('premium.button')}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              {t('upgrade.moneyBack')}
            </p>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('benefits.title')}
            </h3>
            <p className="text-lg text-gray-600">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t('benefits.moreLeads.title'),
                description: t('benefits.moreLeads.description'),
                icon: '📈',
                color: 'bg-green-100 text-green-600'
              },
              {
                title: t('benefits.topVisibility.title'),
                description: t('benefits.topVisibility.description'),
                icon: '🔝',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                title: t('benefits.adsControl.title'),
                description: t('benefits.adsControl.description'),
                icon: '🎯',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                title: t('benefits.fastGrowth.title'),
                description: t('benefits.fastGrowth.description'),
                icon: '🚀',
                color: 'bg-orange-100 text-orange-600'
              }
            ].map((benefit, index) => (
              <Card key={index} className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${benefit.color} mb-4`}>
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 