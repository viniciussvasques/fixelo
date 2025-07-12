'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  Shield, 
  Clock, 
  CreditCard, 
  MessageCircle, 
  Star, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function Features() {
  const t = useTranslations('features')
  
  const features = [
    {
      icon: Shield,
      title: t('verifiedProfessionals.title'),
      description: t('verifiedProfessionals.description'),
      highlight: t('verifiedProfessionals.highlight'),
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: t('instantBooking.title'),
      description: t('instantBooking.description'),
      highlight: t('instantBooking.highlight'),
      color: "text-blue-600"
    },
    {
      icon: CreditCard,
      title: t('securePayments.title'),
      description: t('securePayments.description'),
      highlight: t('securePayments.highlight'),
      color: "text-purple-600"
    },
    {
      icon: MessageCircle,
      title: t('directChat.title'),
      description: t('directChat.description'),
      highlight: t('directChat.highlight'),
      color: "text-orange-600"
    },
    {
      icon: Star,
      title: t('qualityGuarantee.title'),
      description: t('qualityGuarantee.description'),
      highlight: t('qualityGuarantee.highlight'),
      color: "text-yellow-600"
    },
    {
      icon: MapPin,
      title: t('localCoverage.title'),
      description: t('localCoverage.description'),
      highlight: t('localCoverage.highlight'),
      color: "text-red-600"
    }
  ]

  const stats = [
    { number: "50K+", label: t('stats.happyCustomers') },
    { number: "10K+", label: t('stats.verifiedProfessionals') },
    { number: "120+", label: t('stats.serviceCategories') },
    { number: "4.9", label: t('stats.averageRating') }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="info" className="mb-4">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title.line1')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('title.highlight')}
            </span> {t('title.line2')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-100 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              {t('stats.trustedTitle')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>{t('trust.sslEncrypted')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>{t('trust.gdprCompliant')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>{t('trust.support247')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>{t('trust.moneyBackGuarantee')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 