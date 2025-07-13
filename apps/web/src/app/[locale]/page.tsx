'use client'

import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Categories } from '@/components/sections/categories'
import { Testimonials } from '@/components/sections/testimonials'
import { CTA } from '@/components/sections/cta'
import { PlanComparison } from '@/components/ui/plan-comparison'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Features />
      <HowItWorks />
      <PlanComparison />
      <Testimonials />
      <CTA />
    </>
  )
}
