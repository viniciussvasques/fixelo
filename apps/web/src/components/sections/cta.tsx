import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-20 bg-primary-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and professionals in Florida
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
            Find Services
          </Button>
          <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
            Become a Professional
          </Button>
        </div>
      </div>
    </section>
  )
} 