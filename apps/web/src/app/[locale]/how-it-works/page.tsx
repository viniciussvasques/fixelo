'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { 
  Search, 
  UserCheck, 
  Calendar, 
  Star, 
  Shield,
  Clock,
  CreditCard,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HowItWorksPage() {
  const t = useTranslations('howItWorks')

  const steps = [
    {
      icon: Search,
      title: t('steps.search.title'),
      description: t('steps.search.description'),
      features: [
        t('steps.search.features.browse'),
        t('steps.search.features.filter'),
        t('steps.search.features.compare')
      ],
      color: 'text-blue-600'
    },
    {
      icon: UserCheck,
      title: t('steps.choose.title'),
      description: t('steps.choose.description'),
      features: [
        t('steps.choose.features.profile'),
        t('steps.choose.features.reviews'),
        t('steps.choose.features.verification')
      ],
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      title: t('steps.book.title'),
      description: t('steps.book.description'),
      features: [
        t('steps.book.features.schedule'),
        t('steps.book.features.payment'),
        t('steps.book.features.confirmation')
      ],
      color: 'text-purple-600'
    },
    {
      icon: Star,
      title: t('steps.enjoy.title'),
      description: t('steps.enjoy.description'),
      features: [
        t('steps.enjoy.features.service'),
        t('steps.enjoy.features.support'),
        t('steps.enjoy.features.review')
      ],
      color: 'text-orange-600'
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: t('benefits.security.title'),
      description: t('benefits.security.description'),
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: t('benefits.speed.title'),
      description: t('benefits.speed.description'),
      color: 'text-green-600'
    },
    {
      icon: CreditCard,
      title: t('benefits.payment.title'),
      description: t('benefits.payment.description'),
      color: 'text-purple-600'
    },
    {
      icon: MessageSquare,
      title: t('benefits.communication.title'),
      description: t('benefits.communication.description'),
      color: 'text-orange-600'
    },
    {
      icon: Users,
      title: t('benefits.community.title'),
      description: t('benefits.community.description'),
      color: 'text-red-600'
    },
    {
      icon: Award,
      title: t('benefits.quality.title'),
      description: t('benefits.quality.description'),
      color: 'text-yellow-600'
    }
  ]

  const faqs = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-4">
                {t('badge')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {t('title.line1')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('title.highlight')}
                </span> {t('title.line2')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('steps.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('steps.subtitle')}
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-8 text-center">
                        {/* Step number */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        
                        <div className={`p-4 rounded-lg bg-gray-100 inline-block mb-6 ${step.color}`}>
                          <step.icon className="h-8 w-8" />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {step.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {step.description}
                        </p>
                        
                        <div className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('benefits.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('benefits.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className={`p-3 rounded-lg bg-gray-100 inline-block mb-4 ${benefit.color}`}>
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* For Clients vs Professionals */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('comparison.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('comparison.subtitle')}
              </p>
            </motion.div>

            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="clients">{t('comparison.clients.tab')}</TabsTrigger>
                <TabsTrigger value="professionals">{t('comparison.professionals.tab')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clients" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {[
                    {
                      icon: Search,
                      title: t('comparison.clients.features.search.title'),
                      description: t('comparison.clients.features.search.description')
                    },
                    {
                      icon: Shield,
                      title: t('comparison.clients.features.security.title'),
                      description: t('comparison.clients.features.security.description')
                    },
                    {
                      icon: CreditCard,
                      title: t('comparison.clients.features.payment.title'),
                      description: t('comparison.clients.features.payment.description')
                    },
                    {
                      icon: MessageSquare,
                      title: t('comparison.clients.features.communication.title'),
                      description: t('comparison.clients.features.communication.description')
                    },
                    {
                      icon: Star,
                      title: t('comparison.clients.features.reviews.title'),
                      description: t('comparison.clients.features.reviews.description')
                    },
                    {
                      icon: Zap,
                      title: t('comparison.clients.features.speed.title'),
                      description: t('comparison.clients.features.speed.description')
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 inline-block mb-4">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="professionals" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {[
                    {
                      icon: Users,
                      title: t('comparison.professionals.features.clients.title'),
                      description: t('comparison.professionals.features.clients.description')
                    },
                    {
                      icon: Award,
                      title: t('comparison.professionals.features.verification.title'),
                      description: t('comparison.professionals.features.verification.description')
                    },
                    {
                      icon: CreditCard,
                      title: t('comparison.professionals.features.payment.title'),
                      description: t('comparison.professionals.features.payment.description')
                    },
                    {
                      icon: MessageSquare,
                      title: t('comparison.professionals.features.communication.title'),
                      description: t('comparison.professionals.features.communication.description')
                    },
                    {
                      icon: Star,
                      title: t('comparison.professionals.features.reviews.title'),
                      description: t('comparison.professionals.features.reviews.description')
                    },
                    {
                      icon: Zap,
                      title: t('comparison.professionals.features.tools.title'),
                      description: t('comparison.professionals.features.tools.description')
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="p-3 rounded-lg bg-green-100 text-green-600 inline-block mb-4">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('faq.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('faq.subtitle')}
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  {t('cta.findServicesButton')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                  {t('cta.becomeProfessionalButton')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer is already in the layout */}
    </div>
  )
} 