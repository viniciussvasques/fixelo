'use client'

import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useCategories } from '@/hooks/use-categories'
import { Paintbrush, Wrench, Scissors, Heart, Flower2, Zap, Droplet, Home } from 'lucide-react'

export function Categories() {
  const t = useTranslations('categories')
  const router = useRouter()
  const locale = useLocale()
  const { categories, isLoading } = useCategories()
  
  const handleCategoryClick = (slug: string) => {
    router.push(`/${locale}/services?category=${slug}`)
  }

  // Function to get icon for category
  const getCategoryIcon = (slug: string) => {
    const iconProps = "h-6 w-6 text-blue-600"
    
    switch (slug) {
      case 'cleaning':
        return <Home className={iconProps} />
      case 'repairs':
        return <Wrench className={iconProps} />
      case 'beauty':
        return <Scissors className={iconProps} />
      case 'personal-care':
        return <Heart className={iconProps} />
      case 'gardening':
        return <Flower2 className={iconProps} />
      case 'electrical':
        return <Zap className={iconProps} />
      case 'plumbing':
        return <Droplet className={iconProps} />
      case 'painting':
        return <Paintbrush className={iconProps} />
      default:
        return <Home className={iconProps} />
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={`loading-${i}`} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category, index) => (
            <div 
              key={`category-${category.id}-${index}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {getCategoryIcon(category.slug)}
              </div>
              <h3 className="font-semibold mb-2 text-center">{category.name}</h3>
              <p className="text-sm text-gray-600 text-center">
                {category.serviceCount || '0'} {t('serviceLabel')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 