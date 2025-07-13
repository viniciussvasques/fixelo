'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestNavigationPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const languages = {
    en: { label: 'English', flag: '🇺🇸' },
    pt: { label: 'Português', flag: '🇧🇷' },
    es: { label: 'Español', flag: '🇪🇸' }
  }

  const handleLanguageChange = (newLocale: string) => {
    // Extract the path without locale
    const segments = pathname.split('/').filter(Boolean)
    
    // Remove current locale from segments
    const pathWithoutLocale = segments.slice(1).join('/')
    
    // Construct new path with new locale
    const newPath = `/${newLocale}/${pathWithoutLocale}`
    
    console.log('🔄 Changing language:', {
      currentLocale: locale,
      newLocale,
      currentPath: pathname,
      newPath
    })
    
    router.replace(newPath)
  }

  const testPages = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Teste de Navegação e Traduções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Current Status */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Status Atual</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Idioma Atual:</strong> {locale} ({languages[locale as keyof typeof languages]?.label})
                </div>
                <div>
                  <strong>Path Atual:</strong> {pathname}
                </div>
                <div>
                  <strong>Tradução Teste:</strong> {t('welcome')}
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <div>
              <h3 className="font-semibold mb-3">Trocar Idioma</h3>
              <div className="flex gap-2">
                {Object.entries(languages).map(([code, lang]) => (
                  <Button
                    key={code}
                    variant={locale === code ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange(code)}
                    className="flex items-center gap-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Test Pages */}
            <div>
              <h3 className="font-semibold mb-3">Testar Páginas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {testPages.map((page) => (
                  <Button
                    key={page.name}
                    variant="outline"
                    onClick={() => router.push(`/${locale}${page.path}`)}
                    className="justify-start"
                  >
                    {page.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Debug Info</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify({
                  locale,
                  pathname,
                  segments: pathname.split('/').filter(Boolean),
                  testTranslation: t('welcome')
                }, null, 2)}
              </pre>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
} 