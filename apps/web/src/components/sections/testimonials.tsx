export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">"Amazing service! Found a great cleaning lady in Miami within minutes."</p>
            <div className="font-semibold">Sarah Johnson</div>
            <div className="text-sm text-gray-500">Miami, FL</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">"As a handyman, Fixelo helped me grow my business significantly."</p>
            <div className="font-semibold">Carlos Rodriguez</div>
            <div className="text-sm text-gray-500">Orlando, FL</div>
          </div>
        </div>
      </div>
    </section>
  )
} 