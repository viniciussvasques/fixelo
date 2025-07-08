export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Fixelo?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Verified Professionals</h3>
            <p className="text-gray-600">All professionals are background checked and verified</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Instant Booking</h3>
            <p className="text-gray-600">Book services instantly with real-time availability</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
            <p className="text-gray-600">Pay securely through our integrated payment system</p>
          </div>
        </div>
      </div>
    </section>
  )
} 