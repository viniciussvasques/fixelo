'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, Star, MessageCircle, CreditCard, TrendingUp, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'

export default function DashboardPage() {
  const router = useRouter()
  const locale = useLocale()
  const { user } = useAuthStore()
  const t = useTranslations()

  const stats = [
    {
      title: t('dashboard.stats.servicesBooked'),
      value: '12',
      description: t('dashboard.stats.thisMonth'),
      icon: Calendar,
      color: 'text-blue-600',
      trend: t('dashboard.stats.trend.servicesBooked')
    },
    {
      title: t('dashboard.stats.reviewsGiven'),
      value: '8',
      description: t('dashboard.stats.total'),
      icon: Star,
      color: 'text-yellow-600',
      trend: t('dashboard.stats.trend.reviewsGiven')
    },
    {
      title: t('dashboard.stats.messages'),
      value: '3',
      description: t('dashboard.stats.unread'),
      icon: MessageCircle,
      color: 'text-green-600',
      trend: t('dashboard.stats.trend.messages')
    },
    {
      title: t('dashboard.stats.totalSpent'),
      value: '$1,245',
      description: t('dashboard.stats.thisYear'),
      icon: CreditCard,
      color: 'text-purple-600',
      trend: t('dashboard.stats.trend.totalSpent')
    }
  ]

  const recentBookings = [
    {
      id: 1,
      service: t('dashboard.bookings.houseCleaning'),
      provider: 'Maria Silva',
      date: '2024-01-15',
      time: '14:00',
      status: t('dashboard.bookings.status.confirmed'),
      price: '$120',
      image: '/placeholder-service.jpg'
    },
    {
      id: 2,
      service: t('dashboard.bookings.electricalRepair'),
      provider: 'João Santos',
      date: '2024-01-18',
      time: '10:00',
      status: t('dashboard.bookings.status.inProgress'),
      price: '$85',
      image: '/placeholder-service.jpg'
    },
    {
      id: 3,
      service: t('dashboard.bookings.gardening'),
      provider: 'Ana Costa',
      date: '2024-01-20',
      time: '08:00',
      status: t('dashboard.bookings.status.scheduled'),
      price: '$95',
      image: '/placeholder-service.jpg'
    }
  ]

  const quickActions = [
    {
      title: t('dashboard.quickActions.searchServices'),
      description: t('dashboard.quickActions.searchServicesDescription'),
      icon: Plus,
      action: () => router.push(`/${locale}/services`),
      color: 'bg-blue-500'
    },
    {
      title: t('dashboard.quickActions.myBookings'),
      description: t('dashboard.quickActions.myBookingsDescription'),
      icon: Calendar,
      action: () => router.push(`/${locale}/dashboard/bookings`),
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.quickActions.messages'),
      description: t('dashboard.quickActions.messagesDescription'),
      icon: MessageCircle,
      action: () => router.push(`/${locale}/dashboard/messages`),
      color: 'bg-purple-500'
    },
    {
      title: t('dashboard.quickActions.settings'),
      description: t('dashboard.quickActions.settingsDescription'),
      icon: Settings,
      action: () => router.push(`/${locale}/dashboard/settings`),
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: user?.firstName || 'User' })}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('dashboard.upcomingBookings')}</CardTitle>
                <CardDescription>
                  {t('dashboard.upcomingBookingsDescription')}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/${locale}/dashboard/bookings`)}
              >
                {t('dashboard.viewAll')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <img
                    src={booking.image}
                    alt={booking.service}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {booking.service}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {booking.provider} • {booking.date} {t('dashboard.at')} {booking.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        booking.status === t('dashboard.bookings.status.confirmed') ? 'default' :
                        booking.status === t('dashboard.bookings.status.inProgress') ? 'secondary' :
                        'outline'
                      }
                    >
                      {booking.status}
                    </Badge>
                    <span className="font-medium text-gray-900">
                      {booking.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.quickActions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center p-3 rounded-lg border hover:shadow-sm transition-shadow text-left"
              >
                <div className={`p-2 rounded-md ${action.color} mr-3`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>
            {t('dashboard.recentActivityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('dashboard.activity.bookingConfirmed')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('dashboard.activity.bookingConfirmedDetail')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('dashboard.activity.reviewSent')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('dashboard.activity.reviewSentDetail')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('dashboard.activity.newMessage')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('dashboard.activity.newMessageDetail')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 