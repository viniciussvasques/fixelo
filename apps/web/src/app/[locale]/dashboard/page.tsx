'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, Star, MessageCircle, CreditCard, TrendingUp, Plus, Settings, ArrowRight } from 'lucide-react'
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
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      trend: t('dashboard.stats.trend.servicesBooked', { count: 12 })
    },
    {
      title: t('dashboard.stats.reviewsGiven'),
      value: '8',
      description: t('dashboard.stats.total'),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      gradient: 'from-yellow-500 to-yellow-600',
      trend: t('dashboard.stats.trend.reviewsGiven', { count: 8 })
    },
    {
      title: t('dashboard.stats.messages'),
      value: '3',
      description: t('dashboard.stats.unread'),
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradient: 'from-green-500 to-green-600',
      trend: t('dashboard.stats.trend.messages', { count: 3 })
    },
    {
      title: t('dashboard.stats.totalSpent'),
      value: '$1,245',
      description: t('dashboard.stats.thisYear'),
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      trend: t('dashboard.stats.trend.totalSpent', { count: 15 })
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
      image: '/placeholder-service.jpg',
      statusColor: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 2,
      service: t('dashboard.bookings.electricalRepair'),
      provider: 'João Santos',
      date: '2024-01-18',
      time: '10:00',
      status: t('dashboard.bookings.status.inProgress'),
      price: '$85',
      image: '/placeholder-service.jpg',
      statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      id: 3,
      service: t('dashboard.bookings.gardening'),
      provider: 'Ana Costa',
      date: '2024-01-20',
      time: '08:00',
      status: t('dashboard.bookings.status.scheduled'),
      price: '$95',
      image: '/placeholder-service.jpg',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  ]

  const quickActions = [
    {
      title: t('dashboard.quickActions.searchServices'),
      description: t('dashboard.quickActions.searchServicesDescription'),
      icon: Plus,
      action: () => router.push(`/${locale}/services`),
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700'
    },
    {
      title: t('dashboard.quickActions.myBookings'),
      description: t('dashboard.quickActions.myBookingsDescription'),
      icon: Calendar,
      action: () => router.push(`/${locale}/dashboard/bookings`),
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-600 to-green-700'
    },
    {
      title: t('dashboard.quickActions.messages'),
      description: t('dashboard.quickActions.messagesDescription'),
      icon: MessageCircle,
      action: () => router.push(`/${locale}/dashboard/messages`),
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700'
    },
    {
      title: t('dashboard.quickActions.settings'),
      description: t('dashboard.quickActions.settingsDescription'),
      icon: Settings,
      action: () => router.push(`/${locale}/dashboard/settings`),
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'from-orange-600 to-orange-700'
    }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {t('dashboard.welcome', { name: user?.firstName || 'User' })}
        </h1>
        <p className="text-lg text-gray-600">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <p className="text-sm text-gray-500 mb-3">
                {stat.description}
              </p>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">{t('dashboard.upcomingBookings')}</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {t('dashboard.upcomingBookingsDescription')}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/${locale}/dashboard/bookings`)}
                className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                {t('dashboard.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center space-x-4 p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-200 bg-white hover:bg-gray-50/50"
                >
                  <div className="relative">
                    <img
                      src={booking.image}
                      alt={booking.service}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Calendar className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate text-lg">
                      {booking.service}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.provider} • {booking.date} {t('dashboard.at')} {booking.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={`px-3 py-1 text-xs font-semibold border ${booking.statusColor}`}
                    >
                      {booking.status}
                    </Badge>
                    <span className="font-bold text-lg text-gray-900">
                      {booking.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-gray-900">{t('dashboard.quickActions.title')}</CardTitle>
            <CardDescription className="text-gray-600">
              {t('dashboard.quickActions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 text-left bg-white hover:bg-gray-50/50 group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:shadow-xl transition-all duration-200 mr-4`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base">{action.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8 border-0 shadow-xl bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-bold text-gray-900">{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription className="text-gray-600">
            {t('dashboard.recentActivityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900">
                  {t('dashboard.activity.bookingConfirmed')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('dashboard.activity.bookingConfirmedDetail')}
                </p>
              </div>
              <div className="text-xs text-gray-400">2h ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-green-50/50 border border-green-100">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900">
                  {t('dashboard.activity.reviewSent')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('dashboard.activity.reviewSentDetail')}
                </p>
              </div>
              <div className="text-xs text-gray-400">4h ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900">
                  {t('dashboard.activity.newMessage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('dashboard.activity.newMessageDetail')}
                </p>
              </div>
              <div className="text-xs text-gray-400">6h ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 