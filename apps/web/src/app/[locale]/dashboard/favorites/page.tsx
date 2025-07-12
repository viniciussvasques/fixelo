'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Heart, Star, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FavoritesPage() {
  const t = useTranslations('dashboard.favorites')

  // Mock data - replace with real API call
  const favorites = [
    {
      id: '1',
      title: 'Professional House Cleaning',
      provider: 'Maria Silva',
      rating: 4.9,
      price: 120,
      image: '/placeholder-service.jpg',
      location: 'Miami, FL'
    },
    {
      id: '2', 
      title: 'Plumbing Repair Services',
      provider: 'John Santos',
      rating: 4.7,
      price: 95,
      image: '/placeholder-service.jpg',
      location: 'Orlando, FL'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('empty.description')}
            </p>
            <Button>
              {t('empty.cta')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {favorites.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          by {service.provider}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{service.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          ${service.price}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                          <Button size="sm">
                            {t('bookNow')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 