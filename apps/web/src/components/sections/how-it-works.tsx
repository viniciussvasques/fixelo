'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Search,
  CreditCard,
  Calendar,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function HowItWorks() {
  const t = useTranslations('howItWorks')
  
  const steps = [
    {
      number: 1,
      icon: Search,
      title: t('steps.search.title'),
      description: t('steps.search.description'),
      details: [
        t('steps.search.details.0'),
        t('steps.search.details.1'),
        t('steps.search.details.2'),
        t('steps.search.details.3')
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      icon: Calendar,
      title: t('steps.book.title'),
      description: t('steps.book.description'),
      details: [
        t('steps.book.details.0'),
        t('steps.book.details.1'),
        t('steps.book.details.2'),
        t('steps.book.details.3')
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 3,
      icon: CreditCard,
      title: t('steps.pay.title'),
      description: t('steps.pay.description'),
      details: [
        t('steps.pay.details.0'),
        t('steps.pay.details.1'),
        t('steps.pay.details.2'),
        t('steps.pay.details.3')
      ],
      color: "from-green-500 to-green-600"
    }
  ]

  const benefits = [
    {
      icon: CheckCircle2,
      title: t('benefits.noHiddenFees.title'),
      description: t('benefits.noHiddenFees.description')
    },
    {
      icon: CheckCircle2,
      title: t('benefits.support247.title'),
      description: t('benefits.support247.description')
    },
    {
      icon: CheckCircle2,
      title: t('benefits.moneyBack.title'),
      description: t('benefits.moneyBack.description')
    },
    {
      icon: CheckCircle2,
      title: t('benefits.instantBooking.title'),
      description: t('benefits.instantBooking.description')
    }
  ]

  return (
    <section className="py-20 bg-white">
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
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-12 mb-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Step Card */}
              <div className="flex-1">
                <Card className="relative overflow-hidden border-0 shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5`}></div>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} text-white`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} text-white flex items-center justify-center font-bold text-sm`}>
                            {step.number}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-lg">
                          {step.description}
                        </p>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center gap-2 text-gray-600">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visual separator */}
              <div className="flex-shrink-0">
                <div className="hidden lg:block w-px h-32 bg-gray-200"></div>
                <div className="lg:hidden w-32 h-px bg-gray-200"></div>
              </div>

              {/* Step illustration placeholder */}
              <div className="flex-1 flex justify-center">
                <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <step.icon className="h-24 w-24 text-white opacity-80" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('benefits.title')}
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <benefit.icon className="h-8 w-8 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('benefits.title')}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('benefits.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                {t('benefits.findServices')}
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                {t('benefits.becomeProfessional')}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 