'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/hooks/use-categories'
import { Paintbrush, Wrench, Scissors, Heart, Flower2, Zap, Droplet, Home } from 'lucide-react'

// Map of category slugs to icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'cleaning': <Home className="h-6 w-6 text-blue-600" />,
  'repairs': <Wrench className="h-6 w-6 text-blue-600" />,
  'beauty': <Scissors className="h-6 w-6 text-blue-600" />,
  'personal-care': <Heart className="h-6 w-6 text-blue-600" />,
  'gardening': <Flower2 className="h-6 w-6 text-blue-600" />,
  'electrical': <Zap className="h-6 w-6 text-blue-600" />,
  'plumbing': <Droplet className="h-6 w-6 text-blue-600" />,
  'painting': <Paintbrush className="h-6 w-6 text-blue-600" />
}

export function Categories() {
  const t = useTranslations('categories')
  const router = useRouter()
  const { categories, isLoading } = useCategories()
  
  const handleCategoryClick = (slug: string) => {
    router.push(`/services?category=${slug}`)
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
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
          {categories.slice(0, 8).map((category) => (
            <div 
              key={category.id} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {CATEGORY_ICONS[category.slug] || <Home className="h-6 w-6 text-blue-600" />}
              </div>
              <h3 className="font-semibold mb-2 text-center">{category.name}</h3>
              <p className="text-sm text-gray-600 text-center">
                {category.serviceCount || '0'} {t('services')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 