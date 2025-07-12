'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Categories } from '@/components/sections/categories'
import { Testimonials } from '@/components/sections/testimonials'
import { CTA } from '@/components/sections/cta'
import { PlanComparison } from '@/components/ui/plan-comparison'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Features />
        <HowItWorks />
        <PlanComparison />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
