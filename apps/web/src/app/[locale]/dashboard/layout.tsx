'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Star, 
  User, 
  CreditCard, 
  Settings,
  Wrench,
  DollarSign,
  BarChart3,
  Megaphone,
  Target,
  Zap,
  TrendingUp,
  Crown,
  Menu,
  X,
  LogOut,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import { useEffect } from 'react'
import { usePlans } from '@/hooks/use-plans'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated, isLoading, initializeAuth } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const t = useTranslations('dashboard.navigation')
  const locale = useLocale()
  const { currentPlan, isLoading: planLoading } = usePlans()

  // Inicializar autenticação quando o componente montar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initializeAuth()
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setAuthChecked(true)
      }
    }

    if (!authChecked) {
      checkAuth()
    }
  }, [initializeAuth, authChecked])

  // Client-side guard
  useEffect(() => {
    if (authChecked && !isLoading && !isAuthenticated) {
      console.log('🔐 Dashboard Layout - Redirecting to auth, authChecked:', authChecked, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated)
      router.replace(`/${locale}/auth`)
    }
  }, [authChecked, isLoading, isAuthenticated, locale, router])

  // Mostrar loading enquanto verifica autenticação
  if (!authChecked || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (o useEffect acima fará o redirect)
  if (!isAuthenticated) {
    return null
  }

  // Lógica condicional de funcionalidades por plano
  const isPro = currentPlan?.type === 'PRO'

  // Navegação específica para CLIENTs
  const clientNavigation = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('bookings'), href: '/dashboard/bookings', icon: Calendar },
    { name: t('messages'), href: '/dashboard/messages', icon: MessageCircle },
    { name: t('favorites'), href: '/dashboard/favorites', icon: Heart },
    { name: t('reviews'), href: '/dashboard/reviews', icon: Star },
    { name: t('profile'), href: '/dashboard/profile', icon: User },
    { name: t('payments'), href: '/dashboard/payments', icon: CreditCard },
    { name: t('settings'), href: '/dashboard/settings', icon: Settings },
  ]

  // Navegação específica para PROVIDERs
  const providerNavigationItems = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('services'), href: '/dashboard/services', icon: Wrench },
    { name: t('bookings'), href: '/dashboard/bookings', icon: Calendar },
    { name: t('messages'), href: '/dashboard/messages', icon: MessageCircle },
    { name: t('reviews'), href: '/dashboard/reviews', icon: Star },
    ...(isPro ? [{ name: t('earnings'), href: '/dashboard/earnings', icon: DollarSign }] : []),
    ...(isPro ? [{ name: t('analytics'), href: '/dashboard/analytics', icon: BarChart3 }] : []),
    {
      name: t('ads'),
      href: '/dashboard/ads',
      icon: Megaphone,
      badge: 'PRO',
      children: isPro
        ? [
            { name: t('campaigns'), href: '/dashboard/ads/campaigns', icon: Target },
            { name: t('boost'), href: '/dashboard/ads/boost', icon: Zap },
            { name: t('performance'), href: '/dashboard/ads/performance', icon: TrendingUp },
          ]
        : [],
    },
    { name: t('subscription'), href: '/dashboard/subscription', icon: Crown },
    { name: t('profile'), href: '/dashboard/profile', icon: User },
    { name: t('payments'), href: '/dashboard/payments', icon: CreditCard },
    { name: t('settings'), href: '/dashboard/settings', icon: Settings },
  ]

  // Selecionar navegação baseada no role do usuário
  const normalizedRole = user?.role ? String(user.role).trim().toUpperCase() : null
  const isProvider = normalizedRole === 'PROVIDER'
  const navigation = isProvider ? providerNavigationItems : clientNavigation

  // Debug log para verificar a role
  console.log('🔍 Dashboard Layout Debug:', {
    userRole: user?.role,
    normalizedRole,
    isProvider,
    navigationType: isProvider ? 'provider' : 'client',
    navigationLength: navigation.length,
    user: user ? { id: user.id, firstName: user.firstName, role: user.role } : null
  })

  const handleLogout = async () => {
    await logout()
    router.replace(`/${locale}/auth`)
  }

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    
    return (
      <div>
        <Link
          href={item.href}
          className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
          }`}
        >
          <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
          }`} />
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <Badge 
              variant="secondary" 
              className={`ml-2 text-xs font-semibold ${
                isActive 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0'
              }`}
            >
              {item.badge}
            </Badge>
          )}
        </Link>
        {hasChildren && (
          <div className="ml-6 mt-2 space-y-1">
            {item.children.map((child: any) => {
              const isChildActive = pathname === child.href
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isChildActive
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <child.icon className={`mr-2 h-4 w-4 transition-colors duration-200 ${
                    isChildActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {child.name}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Banner de upgrade para usuários Free
  const showUpgradeBanner = isProvider && !isPro && !planLoading

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Banner de upgrade */}
      {showUpgradeBanner && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-center py-2 font-semibold shadow-lg md:left-72">
          <div className="flex items-center justify-center gap-2 px-4">
            <span className="text-sm md:text-base">{t('upgradeBanner')}</span>
            <Button
              className="bg-white text-amber-600 font-bold hover:bg-amber-100 px-3 py-1 text-sm"
              onClick={() => router.push(`/${locale}/dashboard/subscription`)}
            >
              {t('pro.cta')}
            </Button>
          </div>
        </div>
      )}
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 flex md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Fixelo</h1>
                  {user?.role === 'PROVIDER' && (
                    <Badge className="mt-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 text-xs font-semibold">
                      <Crown className="w-3 h-3 mr-1" />
                      Provider
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <nav className="px-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4 bg-gray-50/50">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/${locale}/dashboard/profile`)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                aria-label="Perfil"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72 z-40">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-2xl border-r border-gray-200/50">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between flex-shrink-0 px-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Fixelo</h1>
                    {user?.role === 'PROVIDER' && (
                      <Badge className="mt-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 text-xs font-semibold">
                        <Crown className="w-3 h-3 mr-1" />
                        Provider
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Back to Site Button */}
              <div className="px-6 mb-6">
                <Link href={`/${locale}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('backToSite')}
                  </Button>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>

            {/* User Profile Footer */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4 bg-gray-50/50">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/dashboard/profile`)}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  aria-label="Perfil"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  aria-label="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden">
          <div className={`flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 shadow-sm relative z-30 ${showUpgradeBanner ? 'mt-10' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Fixelo</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className={`flex-1 relative overflow-y-auto focus:outline-none ${showUpgradeBanner ? 'pt-10' : ''}`}> {/* pt-10 para compensar altura do banner mais fino */}
          {children}
        </main>
      </div>
    </div>
  )
} 