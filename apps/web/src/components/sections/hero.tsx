'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Perfect
            <span className="text-gradient block">Service Professionals</span>
            in Florida
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with verified professionals for cleaning, repairs, beauty services, and more. 
            Book instantly, chat directly, and pay securely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto">
              Find Services
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Become a Professional
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">50K+</div>
              <div className="text-gray-600">Services Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">10K+</div>
              <div className="text-gray-600">Verified Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">25</div>
              <div className="text-gray-600">Cities in Florida</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 