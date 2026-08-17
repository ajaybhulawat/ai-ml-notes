import Link from "next/link"
import { searchNotes, getAllNotesMeta } from "@/lib/notes"
import Navbar from "@/components/Navbar"

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const results = searchNotes(q)
  const allNotes = getAllNotesMeta()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar allNotes={allNotes} />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Search Academic Notes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search across all subjects, units, formulas, and machine learning topics.
          </p>
        </div>

        {/* Inline Search Input */}
        <form action="/search" method="GET" className="flex gap-3 max-w-2xl">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search topics e.g. Linear Regression, Neural Networks, Unit 1..."
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-xs text-sm shrink-0"
          >
            Search
          </button>
        </form>

        {/* Results Header */}
        {q && (
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-3">
            Search results for &ldquo;<span className="text-indigo-600 dark:text-indigo-400 font-bold">{q}</span>&rdquo; ({results.length} {results.length === 1 ? "result" : "results"} found)
          </div>
        )}

        {/* Results List */}
        {results.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {q ? "No notes matched your search query." : "Type a query above to start searching."}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Try searching for popular topics like &ldquo;Decision Trees&rdquo;, &ldquo;Neural Networks&rdquo;, &ldquo;CNN&rdquo;, &ldquo;Bayesian&rdquo;, or &ldquo;K-Means&rdquo;.
            </p>
            <div className="pt-2">
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
              >
                <span>Browse All Academic Notes</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((note) => (
              <Link
                key={`${note.course}-${note.branch}-${note.slug}`}
                href={`/notes/${note.course}/${note.branch}/${note.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-xs hover:shadow-md dark:hover:border-indigo-700 transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 uppercase">
                      {note.course} / {note.branch}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      {note.unit}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {note.title}
                  </h2>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {note.description || "Click to read full exam study guide..."}
                  </p>

                  {note.keywords && note.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {note.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition">
                  <span>Read Study Guide</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
