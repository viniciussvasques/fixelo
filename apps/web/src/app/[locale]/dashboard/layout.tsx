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
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import { useEffect } from 'react'

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
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (o useEffect acima fará o redirect)
  if (!isAuthenticated) {
    return null
  }

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
  const providerNavigation = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('services'), href: '/dashboard/services', icon: Wrench },
    { name: t('bookings'), href: '/dashboard/bookings', icon: Calendar },
    { name: t('messages'), href: '/dashboard/messages', icon: MessageCircle },
    { name: t('reviews'), href: '/dashboard/reviews', icon: Star },
    { name: t('earnings'), href: '/dashboard/earnings', icon: DollarSign },
    { name: t('analytics'), href: '/dashboard/analytics', icon: BarChart3 },
    { 
      name: t('ads'), 
      href: '/dashboard/ads', 
      icon: Megaphone,
      badge: 'PRO',
      children: [
        { name: t('campaigns'), href: '/dashboard/ads/campaigns', icon: Target },
        { name: t('boost'), href: '/dashboard/ads/boost', icon: Zap },
        { name: t('performance'), href: '/dashboard/ads/performance', icon: TrendingUp },
      ]
    },
    { name: t('subscription'), href: '/dashboard/subscription', icon: Crown },
    { name: t('profile'), href: '/dashboard/profile', icon: User },
    { name: t('payments'), href: '/dashboard/payments', icon: CreditCard },
    { name: t('settings'), href: '/dashboard/settings', icon: Settings },
  ]

  // Selecionar navegação baseada no role do usuário
  const normalizedRole = user?.role ? String(user.role).trim().toUpperCase() : null
  const isProvider = normalizedRole === 'PROVIDER'
  const navigation = isProvider ? providerNavigation : clientNavigation

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
  }

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    
    return (
      <div>
        <Link
          href={item.href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
        {hasChildren && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map((child: any) => {
              const isChildActive = pathname === child.href
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  className={`group flex items-center px-2 py-1 text-sm rounded-md ${
                    isChildActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <child.icon className={`mr-2 h-4 w-4 ${isChildActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  {child.name}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Fixelo</h1>
              {user?.role === 'PROVIDER' && (
                <Badge variant="outline" className="ml-2">
                  Provider
                </Badge>
              )}
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between flex-shrink-0 px-4">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Fixelo</h1>
                  {user?.role === 'PROVIDER' && (
                    <Badge variant="outline" className="ml-2">
                      Provider
                    </Badge>
                  )}
                </div>
                <Link href={`/${locale}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('backToSite')}
                  </Button>
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Fixelo</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
} 