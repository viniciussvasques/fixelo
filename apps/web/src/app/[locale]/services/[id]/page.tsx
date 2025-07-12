'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Check, 
  Shield, 
  MessageCircle, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Mock data for service details
const mockService = {
  id: '1',
  title: 'Professional House Cleaning',
  description: 'Complete deep cleaning service for your home using eco-friendly products. Our experienced team ensures every corner of your house is spotless.',
  shortDescription: 'Professional house cleaning with eco-friendly products',
  price: 120,
  duration: 180,
  rating: 4.8,
  reviewCount: 124,
  images: [
    '/placeholder-service-1.jpg',
    '/placeholder-service-2.jpg',
    '/placeholder-service-3.jpg',
    '/placeholder-service-4.jpg'
  ],
  location: 'Miami, FL',
  isOnline: false,
  tags: ['cleaning', 'eco-friendly', 'deep-cleaning', 'residential'],
  requirements: [
    'Access to all rooms',
    'Parking space nearby',
    'Clear instructions for special areas'
  ],
  provider: {
    id: '1',
    firstName: 'Maria',
    lastName: 'Silva',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Professional cleaner with 10+ years of experience. Specialized in eco-friendly cleaning solutions.',
    verified: true,
    rating: 4.9,
    reviewCount: 156,
    completedBookings: 340,
    responseTime: '2 hours',
    joinedDate: '2022-01-15'
  },
  reviews: [
    {
      id: '1',
      client: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: '/placeholder-avatar.jpg'
      },
      rating: 5,
      comment: 'Excellent service! Maria was very professional and thorough. My house has never been cleaner.',
      date: '2025-01-05',
      verified: true
    },
    {
      id: '2',
      client: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: '/placeholder-avatar.jpg'
      },
      rating: 4,
      comment: 'Good service, arrived on time and did a great job. Would recommend!',
      date: '2025-01-03',
      verified: true
    }
  ]
}

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const t = useTranslations('serviceDetails')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // TODO: Use params.id to fetch service data
  console.log('Service ID:', params.id)

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockService.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockService.images.length - 1 : prev - 1
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/services" className="hover:text-gray-700">
            {t('breadcrumb.services')}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{mockService.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8"
            >
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={mockService.images[currentImageIndex]}
                  alt={mockService.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevImage}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextImage}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {mockService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Service Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mockService.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {mockService.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {mockService.duration} {t('minutes')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(mockService.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {mockService.rating} ({mockService.reviewCount} {t('reviews')})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {mockService.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {mockService.description}
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">{t('tabs.details')}</TabsTrigger>
                  <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                  <TabsTrigger value="provider">{t('tabs.provider')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('serviceDetails')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('requirements')}</h4>
                        <ul className="space-y-1">
                          {mockService.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('serviceIncludes')}</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">All cleaning supplies included</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Eco-friendly products</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Professional equipment</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('customerReviews')}</CardTitle>
                      <CardDescription>
                        {mockService.reviewCount} {t('reviews')} • {t('averageRating')} {mockService.rating}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mockService.reviews.map((review) => (
                          <div key={review.id} className="flex space-x-4">
                            <Avatar className="h-10 w-10">
                              <img src={review.client.avatar} alt={review.client.firstName} />
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {review.client.firstName} {review.client.lastName}
                                </h4>
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                  {review.verified && (
                                    <Badge variant="secondary" className="ml-2">
                                      <Shield className="h-3 w-3 mr-1" />
                                      {t('verified')}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="provider" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('aboutProvider')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <img src={mockService.provider.avatar} alt={mockService.provider.firstName} />
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {mockService.provider.firstName} {mockService.provider.lastName}
                            </h4>
                            {mockService.provider.verified && (
                              <Badge variant="secondary">
                                <Shield className="h-3 w-3 mr-1" />
                                {t('verified')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{mockService.provider.bio}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">{t('rating')}: </span>
                              <span className="font-medium">{mockService.provider.rating}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('completedJobs')}: </span>
                              <span className="font-medium">{mockService.provider.completedBookings}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('responseTime')}: </span>
                              <span className="font-medium">{mockService.provider.responseTime}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('memberSince')}: </span>
                              <span className="font-medium">{mockService.provider.joinedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                      ${mockService.price}
                    </CardTitle>
                    <Badge variant="secondary">{mockService.duration} {t('minutes')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('bookNow')}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('contactProvider')}
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('instantBooking')}</span>
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('freeRescheduling')}</span>
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('moneyBackGuarantee')}</span>
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 