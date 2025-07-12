'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export function CTA() {
  const t = useTranslations('cta')
  
  return (
    <section className="py-20 bg-primary-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{t('title')}</h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
            {t('findServices')}
          </Button>
          <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
            {t('becomeProfessional')}
          </Button>
        </div>
      </div>
    </section>
  )
} 