import Link from "next/link"
import { getAllNotesMeta } from "@/lib/notes"

export default function LatestTopics() {
  const notes = getAllNotesMeta()

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-10 pb-4 border-b dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Latest Study Topics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Exam-oriented study notes with comparison charts, diagrams, and answer guides.
          </p>
        </div>
        <Link
          href="/notes"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm flex items-center gap-1 group"
        >
          <span>View All Topics</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Grid of Topic Cards matching initial mockup */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {notes.slice(0, 4).map((item) => (
          <Link
            key={`${item.course}-${item.branch}-${item.slug}`}
            href={`/notes/${item.course}/${item.branch}/${item.slug}`}
            className="group bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xs border dark:border-gray-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  {item.course} / {item.branch}
                </span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
                  {item.unit}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug line-clamp-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {item.description || "Comparison charts, solved examples & formulas."}
              </p>
            </div>

            <div className="pt-4 border-t dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Read Guide</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}