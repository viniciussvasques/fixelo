'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Users, 
  DollarSign,
  Sparkles
} from 'lucide-react';

export default function BoostPage() {
  const t = useTranslations();
  const [selectedService, setSelectedService] = useState('');
  const [duration, setDuration] = useState([7]);
  const [dailyBudget, setDailyBudget] = useState([25]);
  const [autoRenew, setAutoRenew] = useState(false);

  // Mock user services
  const userServices = [
    {
      id: '1',
      name: 'Limpeza Residencial Completa',
      category: 'Limpeza',
      price: 150,
      isActive: true,
      currentlyBoosted: false,
      views: 245,
      bookings: 12
    },
    {
      id: '2',
      name: 'Jardinagem e Paisagismo',
      category: 'Jardinagem',
      price: 200,
      isActive: true,
      currentlyBoosted: true,
      boostEndsIn: '3 dias',
      views: 456,
      bookings: 8
    },
    {
      id: '3',
      name: 'Reparos Elétricos',
      category: 'Elétrica',
      price: 120,
      isActive: true,
      currentlyBoosted: false,
      views: 189,
      bookings: 6
    }
  ];

  const cities = [
    'Miami', 'Orlando', 'Tampa', 'Jacksonville', 
    'Fort Lauderdale', 'St. Petersburg', 'Tallahassee', 'Sarasota'
  ];

  const totalCost = duration[0] * dailyBudget[0];
  const estimatedImpressions = duration[0] * dailyBudget[0] * 45;
  const estimatedClicks = Math.round(estimatedImpressions * 0.035);
  const estimatedLeads = Math.round(estimatedClicks * 0.15);

  const quickPackages = [
    {
      name: t('ads.boost.basic'),
      description: t('ads.boost.basicDescription'),
      duration: 7,
      dailyBudget: 15,
      totalCost: 105,
      popular: false
    },
    {
      name: t('ads.boost.standard'),
      description: t('ads.boost.standardDescription'),
      duration: 14,
      dailyBudget: 25,
      totalCost: 350,
      popular: true
    },
    {
      name: t('ads.boost.premium'),
      description: t('ads.boost.premiumDescription'),
      duration: 30,
      dailyBudget: 40,
      totalCost: 1200,
      popular: false
    }
  ];

  const handleQuickPackage = (pkg: typeof quickPackages[0]) => {
    setDuration([pkg.duration]);
    setDailyBudget([pkg.dailyBudget]);
  };

  const handleBoost = () => {
    if (!selectedService) return;
    
    // Here you would integrate with the boost API
    console.log('Starting boost:', {
      serviceId: selectedService,
      duration: duration[0],
      dailyBudget: dailyBudget[0],
      autoRenew,
      totalCost
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('ads.boost.title')}</h1>
        <p className="text-gray-600 mt-1">{t('ads.boost.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                {t('ads.boost.selectService')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{service.name}</h3>
                        {service.currentlyBoosted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Zap className="h-3 w-3 mr-1" />
                            {t('ads.boost.currentlyBoosted')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{service.category} • ${service.price}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {service.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {service.bookings} bookings
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {service.currentlyBoosted ? (
                        <div className="text-sm">
                          <Badge variant="outline" className="text-green-600">
                            {t('ads.boost.boostActive')}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {t('ads.boost.endsIn')} {service.boostEndsIn}
                          </p>
                        </div>
                      ) : (
                        <Badge variant="outline">{t('ads.boost.notBoosted')}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Packages */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ads.boost.quickPackages')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickPackages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-all relative ${
                      pkg.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleQuickPackage(pkg)}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                        Popular
                      </Badge>
                    )}
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-purple-600">${pkg.totalCost}</span>
                        <p className="text-xs text-gray-500">total cost</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Boost Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ads.boost.boostConfiguration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('ads.boost.duration')}: {duration[0]} {t('ads.boost.days')}
                </label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>

              {/* Daily Budget */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('ads.boost.dailyBudget')}: ${dailyBudget[0]}
                </label>
                <Slider
                  value={dailyBudget}
                  onValueChange={setDailyBudget}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$10</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Target Cities */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('ads.boost.targetCities')}
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('ads.boost.selectCities')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Renew */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">{t('ads.boost.autoRenew')}</label>
                  <p className="text-xs text-gray-500">Automatically extend when campaign ends</p>
                </div>
                <Switch
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                {t('ads.boost.totalCost')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{duration[0]} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Budget</span>
                  <span className="font-medium">${dailyBudget[0]}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Cost</span>
                  <span className="text-xl font-bold text-green-600">${totalCost}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {t('ads.boost.estimatedResults')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {t('ads.boost.estimatedImpressions')}
                  </span>
                  <span className="font-medium">{estimatedImpressions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <MousePointer className="h-3 w-3" />
                    {t('ads.boost.estimatedClicks')}
                  </span>
                  <span className="font-medium">{estimatedClicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {t('ads.boost.estimatedLeads')}
                  </span>
                  <span className="font-medium">{estimatedLeads}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button 
            onClick={handleBoost}
            disabled={!selectedService}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            <Zap className="h-4 w-4 mr-2" />
            {t('ads.boost.startBoost')}
          </Button>
        </div>
      </div>
    </div>
  );
} 