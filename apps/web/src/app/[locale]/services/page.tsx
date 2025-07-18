'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { motion } from 'framer-motion'
import { Search, Filter, Star, Grid, List } from 'lucide-react'
import { ServiceCard } from '@/components/services/service-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useServicesSearch } from '@/hooks/use-services'
import { useCategories } from '@/hooks/use-categories'
import { useFloridaCities } from '@/hooks/use-cities'

export default function ServicesPage() {
  const t = useTranslations('services')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get initial search params from URL
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'All'
  const initialLocation = searchParams.get('location') || 'All Cities'
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState('rating')

  // Fetch data using hooks
  const { categories } = useCategories()
  const { cities } = useFloridaCities()
  const { services, isLoading, searchServices } = useServicesSearch()
  
  // Ensure services is always an array
  const servicesArray = Array.isArray(services) ? services : []
  
  // Update search when filters change
  useEffect(() => {
    const filters: any = {
      search: searchQuery,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      sortBy
    }
    
    if (selectedCategory !== 'All') {
      filters.category = selectedCategory
    }
    
    if (selectedLocation !== 'All Cities') {
      filters.city = selectedLocation
    }
    
    searchServices(filters)
    
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (selectedLocation !== 'All Cities') params.set('location', selectedLocation)
    
    const basePath = pathname.split('?')[0] // preserves current /{locale}/services path
    const newUrl = `${basePath}${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedCategory, selectedLocation, sortBy, priceRange, pathname, router, searchServices])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('servicesPage.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('servicesPage.subtitle')}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('servicesPage.searchPlaceholder')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('servicesPage.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-categories" value="All">{t('servicesPage.allCategories')}</SelectItem>
                {Array.isArray(categories) && categories.map((cat, index) => (
                  <SelectItem key={`category-${cat.id || index}`} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t('servicesPage.allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-cities" value="All Cities">{t('servicesPage.allCities')}</SelectItem>
                {Array.isArray(cities) && cities.map((city, index) => (
                  <SelectItem key={`city-${city || index}`} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t('servicesPage.sortBy.rating')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="rating" value="rating">{t('servicesPage.sortBy.rating')}</SelectItem>
                <SelectItem key="price-low" value="price-low">{t('servicesPage.sortBy.priceLow')}</SelectItem>
                <SelectItem key="price-high" value="price-high">{t('servicesPage.sortBy.priceHigh')}</SelectItem>
                <SelectItem key="newest" value="newest">{t('servicesPage.sortBy.newest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                  {t('servicesPage.resultsCount', { count: servicesArray.length })}
                </span>
                {servicesArray.filter(s => s.isSponsored).length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {servicesArray.filter(s => s.isSponsored).length} {t('servicesPage.sponsored')}
                  </span>
                )}
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('servicesPage.filters')}
                </Button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={`loading-card-${i}`} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {servicesArray.map((service, index) => (
              <motion.div
                key={`service-${service.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard 
                  service={{
                    id: service.id,
                    title: service.title,
                    description: service.description,
                    price: service.price,
                    category: service.categoryId || '',
                    images: service.images || [],
                    rating: service.rating || 0,
                    reviewCount: service.reviewCount || 0,
                    location: service.location || '',
                    isAvailable: service.isAvailable || false,
                    responseTime: service.responseTime || '',
                    provider: {
                      id: service.provider?.id || '',
                      name: `${service.provider?.firstName || ''} ${service.provider?.lastName || ''}`.trim(),
                      avatar: service.provider?.avatar,
                      isVerified: service.provider?.verified || false
                    },
                    ...(service.isSponsored && {
                      isSponsored: service.isSponsored,
                      sponsoredType: service.sponsoredType,
                      sponsoredPriority: service.sponsoredPriority
                    })
                  }} 
                  viewMode={viewMode} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && servicesArray.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('servicesPage.noResults')}
            </h3>
            <p className="text-gray-600">
              {t('servicesPage.noResultsDescription')}
            </p>
          </motion.div>
        )}

        {/* Popular Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('servicesPage.popularCategories')}
            </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(categories) && categories.slice(0, 4).map((category, index) => (
              <Card 
                key={`popular-category-${category.id || index}`}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category.slug)}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>
                    {category.serviceCount || 0} {t('services')}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
} 