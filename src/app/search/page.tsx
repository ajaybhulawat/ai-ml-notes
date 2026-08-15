import Link from "next/link"
import { searchNotes } from "@/lib/notes"

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const results = searchNotes(q)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Search Notes
      </h1>
      <p className="text-gray-500 mb-8">
        Search results for &ldquo;<span className="font-semibold text-gray-800">{q}</span>&rdquo; ({results.length} found)
      </p>

      {/* Inline Search Input */}
      <form action="/search" method="GET" className="mb-10 flex gap-3 max-w-xl">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search notes, topics, units..."
          className="flex-1 px-4 py-3 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {results.length === 0 ? (
        <div className="bg-gray-50 border rounded-2xl p-12 text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No notes matched your search.</p>
          <p className="text-sm text-gray-400 mb-6">Try searching for keywords like &ldquo;AI&rdquo;, &ldquo;Neural&rdquo;, &ldquo;Linear&rdquo;, or &ldquo;Unit 1&rdquo;.</p>
          <Link
            href="/notes"
            className="inline-block bg-white border px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-gray-50 shadow-sm"
          >
            Browse All Notes →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {results.map((note) => (
            <Link
              key={`${note.course}-${note.branch}-${note.slug}`}
              href={`/notes/${note.course}/${note.branch}/${note.slug}`}
              className="group bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                  {note.course} / {note.branch}
                </span>
                <span className="text-xs text-gray-400 font-medium">{note.unit}</span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                {note.title}
              </h2>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {note.description || "Click to read full exam notes..."}
              </p>

              <div className="text-xs font-medium text-indigo-600 group-hover:underline">
                Read note →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
