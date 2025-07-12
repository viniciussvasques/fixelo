'use client'

import { useTranslations } from 'next-intl'

export function Testimonials() {
  const t = useTranslations('testimonials')
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">&quot;{t('customer1.text')}&quot;</p>
            <div className="font-semibold">{t('customer1.name')}</div>
            <div className="text-sm text-gray-500">{t('customer1.location')}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">&quot;{t('customer2.text')}&quot;</p>
            <div className="font-semibold">{t('customer2.name')}</div>
            <div className="text-sm text-gray-500">{t('customer2.location')}</div>
          </div>
        </div>
      </div>
    </section>
  )
} 