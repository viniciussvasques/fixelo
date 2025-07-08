'use client'

import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-primary-600">Fixelo</div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary-600">Services</a>
              <a href="#" className="text-gray-600 hover:text-primary-600">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-primary-600">Become a Pro</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
} 