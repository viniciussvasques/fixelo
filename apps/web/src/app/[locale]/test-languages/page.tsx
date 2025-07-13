'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLanguagesPage() {
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
    
    // Remove current locale if it exists (should be the first segment)
    if (segments[0] && ['en', 'pt', 'es'].includes(segments[0])) {
      segments.shift()
    }
    
    // Build new path with new locale
    const pathWithoutLocale = segments.join('/')
    const newPath = `/${newLocale}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`
    
    console.log('🔄 Changing language:', { from: locale, to: newLocale, path: newPath })
    router.push(newPath)
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Teste de Idiomas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informações Atuais</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Locale Atual:</strong> {locale}
              </div>
              <div>
                <strong>Pathname:</strong> {pathname}
              </div>
              <div>
                <strong>Tradução Teste:</strong> {t('loading')}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Trocar Idioma</h3>
            <div className="flex gap-2">
              {Object.entries(languages).map(([key, { label, flag }]) => (
                <Button
                  key={key}
                  variant={locale === key ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange(key)}
                  disabled={locale === key}
                >
                  <span className="mr-2">{flag}</span>
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Links de Teste</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}/services`)}
              >
                Ir para Serviços
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}/test-api`)}
              >
                Ir para Teste API
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}`)}
              >
                Ir para Home
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Debug Info</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                locale,
                pathname,
                segments: pathname.split('/').filter(Boolean),
                translation: t('loading')
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 