'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, Star, MessageCircle, CreditCard, TrendingUp, Plus, Settings, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { useUnreadMessages } from '@/hooks/use-unread-messages'
import { useUserReviews } from '@/hooks/use-user-reviews'
import { useUserPayments } from '@/hooks/use-user-payments'

export default function DashboardPage() {
  const router = useRouter()
  const locale = useLocale()
  const { user } = useAuthStore()
  const t = useTranslations()
  const { stats, recentBookings, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats()
  const { unreadStats, loading: messagesLoading } = useUnreadMessages()
  const { reviewsStats, loading: reviewsLoading } = useUserReviews()
  const { paymentStats, loading: paymentsLoading } = useUserPayments()

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Cards de estatísticas com dados reais
  const dashboardStats = [
    {
      title: t('dashboard.stats.servicesBooked'),
      value: statsLoading ? '...' : (stats?.totalBookings || 0).toString(),
      description: t('dashboard.stats.thisMonth'),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      trend: statsLoading ? '...' : t('dashboard.stats.trend.servicesBooked', { count: stats?.totalBookings || 0 })
    },
    {
      title: t('dashboard.stats.reviewsGiven'),
      value: reviewsLoading ? '...' : (reviewsStats?.totalReviews || 0).toString(),
      description: reviewsStats?.averageRating ? `${reviewsStats.averageRating.toFixed(1)} ⭐ média` : t('dashboard.stats.total'),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      gradient: 'from-yellow-500 to-yellow-600',
      trend: reviewsLoading ? '...' : t('dashboard.stats.trend.reviewsGiven', { count: reviewsStats?.totalReviews || 0 })
    },
    {
      title: t('dashboard.stats.messages'),
      value: messagesLoading ? '...' : (unreadStats?.totalUnread || 0).toString(),
      description: t('dashboard.stats.unread'),
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradient: 'from-green-500 to-green-600',
      trend: messagesLoading ? '...' : t('dashboard.stats.trend.messages', { count: unreadStats?.totalUnread || 0 })
    },
    {
      title: t('dashboard.stats.totalSpent'),
      value: paymentsLoading ? '...' : formatCurrency(paymentStats?.thisYearSpent || 0),
      description: t('dashboard.stats.thisYear'),
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      trend: paymentsLoading ? '...' : t('dashboard.stats.trend.totalSpent', { count: paymentStats?.paymentsCount || 0 })
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
          {t('dashboard.welcome', { name: user?.firstName || 'User' })}
        </h1>
        <p className="text-base lg:text-lg text-gray-600">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Error State */}
      {statsError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Erro ao carregar dados</p>
                <p className="text-xs text-red-600 mt-1">{statsError}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetchStats}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-10">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-md hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                {stat.title}
              </CardTitle>
              <div className={`p-2 sm:p-3 rounded-lg lg:rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                {stat.description}
              </p>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Bookings */}
        <Card className="xl:col-span-2 border-0 shadow-lg lg:shadow-xl bg-white">
          <CardHeader className="pb-4 lg:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">{t('dashboard.upcomingBookings')}</CardTitle>
                <CardDescription className="text-gray-600 mt-1 text-sm lg:text-base">
                  {t('dashboard.upcomingBookingsDescription')}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/${locale}/dashboard/bookings`)}
                className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-xs lg:text-sm"
              >
                {t('dashboard.viewAll')}
                <ArrowRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 lg:p-6 border border-gray-100 rounded-xl animate-pulse">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center space-x-3 lg:space-x-4 p-4 lg:p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50/50"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={booking.service.images?.[0] || '/placeholder-service.jpg'}
                        alt={booking.service.title}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl object-cover shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Calendar className="w-2 h-2 lg:w-3 lg:h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate text-sm lg:text-lg">
                        {booking.service.title}
                      </h4>
                      <p className="text-xs lg:text-sm text-gray-500 mt-1">
                        {booking.provider ? 
                          `${booking.provider.firstName} ${booking.provider.lastName}` : 
                          (booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : 'N/A')
                        } • {formatDate(booking.scheduledAt)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <Badge
                        className={`px-2 lg:px-3 py-1 text-xs font-semibold border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </Badge>
                      <span className="font-bold text-sm lg:text-lg text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 lg:py-12">
                <Calendar className="h-12 w-12 lg:h-16 lg:w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Nenhum agendamento encontrado</p>
                <p className="text-gray-400 text-sm mt-1">Seus próximos agendamentos aparecerão aqui</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg lg:shadow-xl bg-white">
          <CardHeader className="pb-4 lg:pb-6">
            <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">{t('dashboard.quickActions.title')}</CardTitle>
            <CardDescription className="text-gray-600 text-sm lg:text-base">
              {t('dashboard.quickActions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center p-3 lg:p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 text-left bg-white hover:bg-gray-50/50 group"
              >
                <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gradient-to-br ${action.gradient} shadow-md group-hover:shadow-lg transition-all duration-200 mr-3 lg:mr-4 flex-shrink-0`}>
                  <action.icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm lg:text-base">{action.title}</p>
                  <p className="text-xs lg:text-sm text-gray-500 mt-1 line-clamp-2">{action.description}</p>
                </div>
                <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 lg:mt-8 border-0 shadow-lg lg:shadow-xl bg-white">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription className="text-gray-600 text-sm lg:text-base">
            {t('dashboard.recentActivityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-semibold text-gray-900">
                  {t('dashboard.activity.bookingConfirmed')}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  {t('dashboard.activity.bookingConfirmedDetail')}
                </p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">2h ago</div>
            </div>
            
            <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl bg-green-50/50 border border-green-100">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
                  <Star className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-semibold text-gray-900">
                  {t('dashboard.activity.reviewSent')}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  {t('dashboard.activity.reviewSentDetail')}
                </p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">4h ago</div>
            </div>
            
            <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
                  <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-semibold text-gray-900">
                  {t('dashboard.activity.newMessage')}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  {t('dashboard.activity.newMessageDetail')}
                </p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">6h ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 