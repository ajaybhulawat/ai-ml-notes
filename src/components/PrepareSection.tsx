import Link from "next/link"

export default function PrepareSection() {
  const items = [
    {
      title: "10 Mark Answers",
      description: "Structured long-answer templates with derivations & code.",
      icon: "📋",
      color: "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      link: "/notes",
    },
    {
      title: "Detailed Diagrams",
      description: "Architecture flowcharts, decision trees & neural maps.",
      icon: "🔄",
      color: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      link: "/notes",
    },
    {
      title: "MCQ Practice",
      description: "Interactive quizzes with instant feedback & explanations.",
      icon: "☑️",
      color: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      link: "/mcqs",
    },
    {
      title: "Quick Revision Notes",
      description: "Formula summaries, key definitions & bullet points.",
      icon: "⚡",
      color: "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      link: "/formulas",
    },
  ]

  return (
    <section className="bg-white dark:bg-gray-900 py-16 border-y dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Prepare for Your Exams
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto mb-12">
          Everything you need to score top grades in University &amp; Semester Examinations.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group p-6 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border dark:border-gray-800 hover:shadow-md hover:-translate-y-1 transition-all text-center block"
            >
              <div
                className={`w-20 h-20 mx-auto rounded-full border flex items-center justify-center text-3xl mb-5 shadow-xs transition group-hover:scale-110 ${item.color}`}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}