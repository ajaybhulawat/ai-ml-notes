export default function FeaturedArticles() {
  const articles = [
    "Understanding Decision Trees",
    "Bayesian vs Frequentist",
    "Introduction to Neural Networks"
  ]

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <h3 className="text-2xl font-bold mb-8">
        Featured Articles
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-40 bg-blue-200"></div>
            <div className="p-6">
              <h4 className="font-semibold mb-4">{item}</h4>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}