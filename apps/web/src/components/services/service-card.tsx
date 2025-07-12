'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Star, MapPin, Clock, DollarSign, Heart, Share2, Badge as BadgeIcon, Zap, Crown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    price: number
    category: string
    images: string[]
    rating: number
    reviewCount: number
    location: string
    isAvailable: boolean
    responseTime: string
    provider: {
      id: string
      name: string
      avatar?: string
      isVerified: boolean
    }
    // ADS related fields
    isSponsored?: boolean
    sponsoredType?: 'BOOST' | 'FEATURED' | 'TOP_LIST'
    sponsoredPriority?: number
  }
  viewMode?: 'grid' | 'list'
}

export function ServiceCard({ service, viewMode = 'grid' }: ServiceCardProps) {
  const router = useRouter()
  const t = useTranslations('services')

  // Get sponsored badge info
  const getSponsoredBadgeInfo = () => {
    if (!service.isSponsored) return null
    
    switch (service.sponsoredType) {
      case 'BOOST':
        return {
          icon: Zap,
          label: t('ads.boosted'),
          className: 'bg-blue-500 text-white border-blue-600'
        }
      case 'FEATURED':
        return {
          icon: Crown,
          label: t('ads.featured'),
          className: 'bg-purple-500 text-white border-purple-600'
        }
      case 'TOP_LIST':
        return {
          icon: TrendingUp,
          label: t('ads.topList'),
          className: 'bg-green-500 text-white border-green-600'
        }
      default:
        return {
          icon: Zap,
          label: t('ads.sponsored'),
          className: 'bg-orange-500 text-white border-orange-600'
        }
    }
  }

  const sponsoredInfo = getSponsoredBadgeInfo()

  const handleViewDetails = () => {
    router.push(`/services/${service.id}`)
  }

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/providers/${service.provider.id}`)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement favorite functionality
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement share functionality
  }

  // Use local placeholder images
  const serviceImage = service.images && service.images.length > 0 
    ? service.images[0] 
    : '/images/placeholder-service.svg'
  
  const avatarImage = service.provider.avatar || '/images/placeholder-avatar.svg'

  if (viewMode === 'list') {
    return (
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${
        service.isSponsored ? 'ring-2 ring-blue-200 shadow-md' : ''
      }`} onClick={handleViewDetails}>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={serviceImage}
                alt={service.title}
                className="h-24 w-24 object-cover rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex items-center space-x-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={avatarImage} />
                  <AvatarFallback className="text-xs">
                    {service.provider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleProviderClick}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {service.provider.name}
                </button>
                {service.provider.isVerified && (
                  <BadgeIcon className="h-4 w-4 text-blue-500" />
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-500">({service.reviewCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{service.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{service.responseTime}</span>
                </div>
              </div>

              {/* Price and Category */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{service.category}</Badge>
                  {service.isAvailable && (
                    <Badge variant="default" className="bg-green-500">
                      {t('available')}
                    </Badge>
                  )}
                  {sponsoredInfo && (
                    <Badge className={`${sponsoredInfo.className} flex items-center gap-1`}>
                      <sponsoredInfo.icon className="h-3 w-3" />
                      {sponsoredInfo.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-lg font-bold text-gray-900">
                    ${service.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer overflow-hidden ${
      service.isSponsored ? 'ring-2 ring-blue-200 shadow-md' : ''
    }`} onClick={handleViewDetails}>
      {/* Image */}
      <div className="relative">
        <img
          src={serviceImage}
          alt={service.title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {service.isAvailable && (
            <Badge className="bg-green-500">
              {t('available')}
            </Badge>
          )}
          {sponsoredInfo && (
            <Badge className={`${sponsoredInfo.className} flex items-center gap-1`}>
              <sponsoredInfo.icon className="h-3 w-3" />
              {sponsoredInfo.label}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {service.title}
            </h3>
            <Badge variant="secondary" className="mt-1">
              {service.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-xl font-bold text-gray-900">
              ${service.price}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Provider */}
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarImage} />
            <AvatarFallback className="text-xs">
              {service.provider.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleProviderClick}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {service.provider.name}
          </button>
          {service.provider.isVerified && (
            <BadgeIcon className="h-4 w-4 text-blue-500" />
          )}
        </div>

        {/* Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{service.rating}</span>
              <span className="text-sm text-gray-500">({service.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{service.responseTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{service.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 