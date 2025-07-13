'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MapPin, Star, Shield, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { usePlatformStats } from '@/hooks/use-platform-stats'
import { usePopularServices, PopularService } from '@/hooks/use-popular-services'
import { useFloridaCities } from '@/hooks/use-cities'

export function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  
  const { stats } = usePlatformStats()
  const { popularServices } = usePopularServices()
  const { cities } = useFloridaCities()
  
  // Extract popular service names for the search suggestions
  const popularServiceNames = Array.isArray(popularServices) 
    ? popularServices.slice(0, 6).map((service: PopularService) => service.title)
    : [];

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (location) params.append('location', location)
    
    router.push(`/${locale}/services?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Floating shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main headline with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="outline" className="mb-4 text-sm font-medium">
              {t('badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t('title.line1')}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                {t('title.line2')}
              </span>
              <span className="text-3xl md:text-4xl lg:text-5xl text-gray-700">
                {t('title.line3')}
              </span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
          
          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('search.servicePlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 border-0 bg-transparent focus:ring-0 text-base"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('search.locationPlaceholder')}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 border-0 bg-transparent focus:ring-0 text-base"
                      list="city-list"
                    />
                    <datalist id="city-list">
                      {cities?.map((city: string, index: number) => (
                        <option key={`${city}-${index}`} value={city} />
                      ))}
                    </datalist>
                  </div>
                  <Button 
                    onClick={handleSearch}
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                  >
                    {t('search.button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Popular services */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">{t('search.popularServices')}:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularServiceNames.map((service: string, index: number) => (
                      <Badge 
                        key={`${service}-${index}`} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => setSearchQuery(service)}
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-3"
              onClick={() => router.push(`/${locale}/services`)}
            >
              <Shield className="mr-2 h-5 w-5" />
              {t('cta.findProfessionals')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-3"
              onClick={() => router.push(`/${locale}/auth?mode=register&type=provider`)}
            >
              <Clock className="mr-2 h-5 w-5" />
              {t('cta.becomeProfessional')}
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats?.servicesCompleted?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-600 text-sm md:text-base">{t('stats.servicesCompleted')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats?.verifiedProfessionals?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-600 text-sm md:text-base">{t('stats.verifiedProfessionals')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats?.citiesCount || '0'}
              </div>
              <div className="text-gray-600 text-sm md:text-base">{t('stats.citiesInFlorida')}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats?.averageRating || '0'}
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
              </div>
              <div className="text-gray-600 text-sm md:text-base">{t('stats.averageRating')}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 