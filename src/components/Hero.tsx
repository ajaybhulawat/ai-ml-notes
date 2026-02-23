export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-100 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            AI & ML Exam Notes Made Simple
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Easy & Detailed Study Guides for BTech & MTech Students
          </p>

          <div className="flex gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow">
              Get Started
            </button>

            <button className="bg-white border px-6 py-3 rounded-lg shadow">
              Download PDF Notes
            </button>
          </div>
        </div>

        <div>
          <div className="bg-blue-200 h-80 rounded-xl flex items-center justify-center text-2xl font-semibold text-blue-800">
            AI Illustration
          </div>
        </div>

      </div>
    </section>
  )
}