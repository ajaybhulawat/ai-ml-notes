import Link from "next/link"
import { getNotesForBranch, getBranches, getAllCourses } from "@/lib/notes"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ course: string; branch: string }>
}

export async function generateStaticParams() {
  const courses = getAllCourses()
  const params: { course: string; branch: string }[] = []
  courses.forEach((course) => {
    getBranches(course).forEach((branch) => {
      params.push({ course, branch })
    })
  })
  return params
}

export default async function BranchPage({ params }: Props) {
  const { course, branch } = await params
  const notes = getNotesForBranch(course, branch)

  if (notes.length === 0) return notFound()

  // Group notes by unit
  const grouped = notes.reduce<Record<string, typeof notes>>((acc, note) => {
    const unit = note.unit || "General"
    if (!acc[unit]) acc[unit] = []
    acc[unit].push(note)
    return acc
  }, {})

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 flex-wrap">
        <Link href="/notes" className="hover:text-indigo-600 transition">Notes</Link>
        <span>›</span>
        <Link href={`/notes/${course}`} className="hover:text-indigo-600 transition">{course.toUpperCase()}</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{branch.toUpperCase()}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        {branch.toUpperCase()} — AI &amp; ML Notes
      </h1>
      <p className="text-gray-500 mb-10 text-lg">
        {notes.length} note{notes.length !== 1 ? "s" : ""} across {Object.keys(grouped).length} unit{Object.keys(grouped).length !== 1 ? "s" : ""}
      </p>

      {/* Notes grouped by unit */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([unit, unitNotes]) => (
          <div key={unit}>
            <h2 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
              {unit}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {unitNotes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${course}/${branch}/${note.slug}`}
                  className="group bg-white border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{note.description}</p>
                  <div className="mt-3 text-xs font-medium text-indigo-500 group-hover:underline">
                    Read note →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
