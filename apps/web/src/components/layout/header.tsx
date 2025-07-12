'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Menu, X, Search, User, Bell, MessageCircle, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth-store'
import LanguageSelector from '@/components/layout/language-selector'

export function Header() {
  const tCommon = useTranslations('common')
  const tNavigation = useTranslations('navigation')
  const locale = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'home', href: `/${locale}` },
    { name: 'services', href: `/${locale}/services` },
    { name: 'howItWorks', href: `/${locale}/how-it-works` },
    { name: 'about', href: `/${locale}/about` },
    { name: 'contact', href: `/${locale}/contact` }
  ]

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/${locale}/services?search=${encodeURIComponent(searchTerm)}`)
      setSearchOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Fixelo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {tNavigation(item.name)}
              </Link>
            ))}
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Search Button */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <Input
                    placeholder={tCommon('search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pr-10"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(true)}
                  className="hidden sm:flex"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    3
                  </Badge>
                </Button>

                {/* Messages */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => router.push(`/${locale}/dashboard/messages`)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    2
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` : user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.email}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
                      <User className="mr-2 h-4 w-4" />
                      {tNavigation('dashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/profile`)}>
                      <Settings className="mr-2 h-4 w-4" />
                      {tNavigation('profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)}>
                      <Settings className="mr-2 h-4 w-4" />
                      {tNavigation('settings')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {tNavigation('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/auth?mode=login`)}
                >
                  {tNavigation('login')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/${locale}/auth?mode=register`)}
                >
                  {tNavigation('register')}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-4 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tNavigation(item.name)}
                </Link>
              ))}
              {!user && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => {
                        router.push(`/${locale}/auth?mode=login`)
                        setMobileMenuOpen(false)
                      }}
                    >
                      {tNavigation('login')}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full justify-center mt-2"
                      onClick={() => {
                        router.push(`/${locale}/auth?mode=register`)
                        setMobileMenuOpen(false)
                      }}
                    >
                      {tNavigation('register')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
} 