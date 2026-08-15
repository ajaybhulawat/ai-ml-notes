import Link from "next/link"

export default function FeaturedArticles() {
  const articles = [
    {
      title: "Understanding Decision Trees",
      subtitle: "Step-by-Step Guide",
      description: "Entropy, Information Gain, Gini Impurity, and tree pruning explained with 10-mark exam answers.",
      gradient: "from-blue-600 to-indigo-700",
      icon: "🌳",
      link: "/notes/btech/cse/difference-between-ai-and-ml",
    },
    {
      title: "Bayesian vs. Frequentist",
      subtitle: "Key Differences Explained",
      description: "Comparison chart, prior distributions, conditional probability, and exam comparison tables.",
      gradient: "from-purple-600 to-pink-600",
      icon: "🎲",
      link: "/notes/btech/cse/bayesian-networks",
    },
    {
      title: "Introduction to Neural Networks",
      subtitle: "Basic Concepts for Exams",
      description: "Perceptron architecture, forward propagation, activation functions, and backpropagation steps.",
      gradient: "from-amber-500 to-orange-600",
      icon: "🧠",
      link: "/notes/mtech/cse/convolutional-neural-networks",
    },
  ]

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-10 pb-4 border-b dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Featured Articles
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive articles for comprehensive unit preparation.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((item, index) => (
          <div
            key={index}
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-xs border dark:border-gray-800 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Graphic Banner Header */}
              <div
                className={`h-44 bg-gradient-to-r ${item.gradient} p-6 flex flex-col justify-between text-white relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2 text-6xl opacity-25">
                  {item.icon}
                </div>
                <span className="inline-block self-start px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-white/20 backdrop-blur-xs">
                  {item.subtitle}
                </span>
                <span className="text-4xl">{item.icon}</span>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xl mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0">
              <Link
                href={item.link}
                className="inline-block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}