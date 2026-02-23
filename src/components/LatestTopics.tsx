import Link from "next/link"

export default function LatestTopics() {
  const topics = [
    {
      title: "Difference Between AI and ML",
      slug: "difference-between-ai-and-ml"
    },
    {
      title: "Bayesian Networks Explained",
      slug: "bayesian-networks-explained"
    }
  ]

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">
          Latest Study Topics
        </h3>
        <a href="#" className="text-blue-600 font-medium">
          View All Topics →
        </a>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {topics.map((item, index) => (
          <Link
            key={index}
            href={`/notes/${item.slug}`}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
          >
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-sm text-gray-500">
              Click to read full notes...
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}