export function Categories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Cleaning</h3>
            <p className="text-sm text-gray-600">House & office cleaning</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Repairs</h3>
            <p className="text-sm text-gray-600">Home maintenance & repairs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Beauty</h3>
            <p className="text-sm text-gray-600">Hair, nails, and spa services</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Personal Care</h3>
            <p className="text-sm text-gray-600">Personal training & wellness</p>
          </div>
        </div>
      </div>
    </section>
  )
} 