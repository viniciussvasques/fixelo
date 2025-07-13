'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const languages = {
  en: { label: 'English', flag: '🇺🇸', code: 'en' },
  pt: { label: 'Português', flag: '🇧🇷', code: 'pt' },
  es: { label: 'Español', flag: '🇪🇸', code: 'es' }
}

export default function LanguageSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState<string>(locale)
  
  // Detectar locale atual da URL também
  const detectCurrentLocale = useCallback(() => {
    // Primeiro, tentar pegar da URL
    const pathParts = pathname.split('/').filter(Boolean)
    const urlLocale = pathParts[0]
    
    if (urlLocale && ['en', 'pt', 'es'].includes(urlLocale)) {
      return urlLocale
    }
    
    // Fallback para o locale do hook
    return locale
  }, [pathname, locale])
  
  // Atualizar o locale atual quando mudança for detectada
  useEffect(() => {
    const detectedLocale = detectCurrentLocale()
    setCurrentLocale(detectedLocale)
    console.log('LanguageSelector: Current locale detected as:', detectedLocale, {
      fromHook: locale,
      fromURL: pathname.split('/')[1],
      pathname
    })
  }, [locale, pathname, detectCurrentLocale])

  // Usar fallback para traduções se não estiverem disponíveis
  const t = useTranslations('languageSelector')

  const handleLanguageChange = (newLocale: string) => {
    try {
      console.log('LanguageSelector: Changing from', currentLocale, 'to', newLocale)
      
      // Persist preference in cookie with longer expiration
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;

      // Derive path without current locale prefix
      const parts = pathname.split('/').filter(Boolean)
      if (parts[0] && ['en', 'pt', 'es'].includes(parts[0])) {
        parts.shift()
      }
      const newPath = `/${newLocale}${parts.length ? '/' + parts.join('/') : ''}`

      console.log('LanguageSelector: New path:', newPath)

      // Atualizar estado local imediatamente
      setCurrentLocale(newLocale)

      // Force a full reload to ensure all components re-render with the new locale
      window.location.href = newPath;
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback: simple redirect
      window.location.href = `/${newLocale}`;
    }
  }

  const currentLanguage = languages[currentLocale as keyof typeof languages]
  
  console.log('LanguageSelector render:', {
    locale,
    currentLocale,
    currentLanguage,
    pathname,
    detectedFromURL: pathname.split('/')[1]
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguage?.flag || '🌐'}
          <span className="hidden sm:inline">
            {currentLanguage?.label || currentLocale?.toUpperCase() || 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={currentLocale === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : ''}
        >
          🇺🇸 {t('english')}
          {currentLocale === 'en' && <span className="ml-2 text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('pt')}
          className={currentLocale === 'pt' ? 'bg-blue-50 text-blue-600 font-medium' : ''}
        >
          🇧🇷 {t('portuguese')}
          {currentLocale === 'pt' && <span className="ml-2 text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')}
          className={currentLocale === 'es' ? 'bg-blue-50 text-blue-600 font-medium' : ''}
        >
          🇪🇸 {t('spanish')}
          {currentLocale === 'es' && <span className="ml-2 text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 