import Link from "next/link"
import { getNotesForBranch, getBranches, getAllCourses, getAllNotesMeta, slugifySubject, getUnitNumber } from "@/lib/notes"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"

type Props = {
  params: Promise<{ course: string; branch: string }>
}

const branchLabels: Record<string, string> = {
  cse: "Computer Science & Engineering",
  ece: "Electronics & Communication Engineering",
  civil: "Civil Engineering",
  mech: "Mechanical Engineering",
  it: "Information Technology",
  eee: "Electrical & Electronics Engineering",
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, branch } = await params
  const notes = getNotesForBranch(course, branch)

  if (notes.length === 0) return { title: "Branch Not Found" }

  const branchFullName = branchLabels[branch.toLowerCase()] ?? branch.toUpperCase()

  return {
    title: `${branchFullName} (${branch.toUpperCase()}) Notes | ${course.toUpperCase()}`,
    description: `Complete exam notes, subject guides, unit breakdowns, and formulas for ${branchFullName} (${course.toUpperCase()}).`,
    openGraph: {
      title: `${branchFullName} Notes — ${course.toUpperCase()}`,
      description: `Complete syllabus notes, subject units, and exam revision guides for ${branchFullName}.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${branchFullName} Notes`,
      description: `Exam notes for ${branchFullName}.`,
    },
  }
}

export default async function BranchPage({ params }: Props) {
  const { course, branch } = await params
  const notes = getNotesForBranch(course, branch)
  const allNotes = getAllNotesMeta()

  if (notes.length === 0) return notFound()

  const branchFullName = branchLabels[branch.toLowerCase()] ?? branch.toUpperCase()

  // Group notes by subject, then by unit
  const subjectsMap: Record<string, Record<string, typeof notes>> = {}

  notes.forEach((note) => {
    const subject = note.subject || "General Machine Learning"
    const unit = note.unit || "General Unit"

    if (!subjectsMap[subject]) {
      subjectsMap[subject] = {}
    }
    if (!subjectsMap[subject][unit]) {
      subjectsMap[subject][unit] = []
    }
    subjectsMap[subject][unit].push(note)
  })

  // Extract unique subjects, units, and semesters
  const uniqueSubjects = Object.keys(subjectsMap)
  const uniqueUnits = Array.from(new Set(notes.map((n) => n.unit).filter(Boolean)))
  const uniqueSemesters = Array.from(new Set(notes.map((n) => n.semester).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar allNotes={allNotes} />

      {/* Hero Header */}
      <section className="relative border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Academic Notes
            </Link>
            <span>›</span>
            <Link href={`/notes/${course}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              {course.toUpperCase()}
            </Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-gray-200 font-semibold">{branch.toUpperCase()}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <span>🎓</span> {course.toUpperCase()} · {branch.toUpperCase()} Syllabus
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {branchFullName}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Exam study guides, formula breakdowns, definitions, and step-by-step algorithms for {branchFullName}.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 shrink-0 text-center">
              <div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {notes.length}
                </span>
                <span className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {notes.length === 1 ? "Note" : "Notes"}
                </span>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200">
                  {uniqueSubjects.length}
                </span>
                <span className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {uniqueSubjects.length === 1 ? "Subject" : "Subjects"}
                </span>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200">
                  {uniqueUnits.length}
                </span>
                <span className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {uniqueUnits.length === 1 ? "Unit" : "Units"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Subject Navigation Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <span>📘</span> Available Subjects in {branch.toUpperCase()}
            </h2>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {uniqueSubjects.length} {uniqueSubjects.length === 1 ? "Subject" : "Subjects"} Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueSubjects.map((subjectName) => {
              const subjectSlug = slugifySubject(subjectName)
              const subjectNotesCount = Object.values(subjectsMap[subjectName]).flat().length
              const subjectUnitsCount = Object.keys(subjectsMap[subjectName]).length

              return (
                <Link
                  key={subjectName}
                  href={`/notes/${course}/${branch}/${subjectSlug}`}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xs hover:shadow-md dark:hover:border-indigo-600 transition duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                        {course.toUpperCase()} / {branch.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {subjectNotesCount} {subjectNotesCount === 1 ? "Note" : "Notes"}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                      {subjectName}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      Complete unit notes, formula sheets, and exam revision guides for {subjectName}.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition">
                    <span>Explore Subject Hub ({subjectUnitsCount} {subjectUnitsCount === 1 ? "Unit" : "Units"})</span>
                    <span>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Quick Exam Revision Toolbar */}
        <section className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <span>⚡ Quick Exam Tools:</span>
            {uniqueSemesters.map((sem) => (
              <span key={sem} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px]">
                {sem}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/mcqs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition border border-indigo-200/60 dark:border-indigo-800/60"
            >
              <span>📝</span> Practice MCQs
            </Link>
            <Link
              href="/formulas"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 transition border border-purple-200/60 dark:border-purple-800/60"
            >
              <span>🧮</span> Live Formulas
            </Link>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition border border-emerald-200/60 dark:border-emerald-800/60"
            >
              <span>🔖</span> Saved Bookmarks
            </Link>
          </div>
        </section>

        {/* Subjects & Units Grouped Notes List */}
        <section className="space-y-12">
          {Object.entries(subjectsMap).map(([subjectName, unitsMap]) => {
            const subjectSlug = slugifySubject(subjectName)
            const sortedUnitEntries = Object.entries(unitsMap).sort(
              ([unitA], [unitB]) => getUnitNumber(unitA) - getUnitNumber(unitB)
            )

            return (
              <div key={subjectName} className="space-y-6">
                {/* Subject Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-indigo-600" />
                    <Link href={`/notes/${course}/${branch}/${subjectSlug}`}>
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                        {subjectName}
                      </h2>
                    </Link>
                  </div>
                  <Link
                    href={`/notes/${course}/${branch}/${subjectSlug}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Subject Hub →
                  </Link>
                </div>

                {/* Units & Note Cards */}
                <div className="space-y-8 pl-2 md:pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                  {sortedUnitEntries.map(([unitName, unitNotes]) => (
                    <div key={unitName} className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <span>📖</span> {unitName}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {unitNotes.map((note) => {
                          const noteSubjectSlug = slugifySubject(note.subject || subjectName)

                          return (
                            <div
                              key={note.slug}
                              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg dark:hover:border-indigo-700 transition duration-200"
                            >
                              <div>
                                {/* Card Badges */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <Link
                                    href={`/notes/${course}/${branch}/${noteSubjectSlug}`}
                                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 hover:underline"
                                  >
                                    {note.subject || subjectName}
                                  </Link>
                                  {note.semester && (
                                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                      {note.semester}
                                    </span>
                                  )}
                                </div>

                                <Link href={`/notes/${course}/${branch}/${noteSubjectSlug}/${note.slug}`}>
                                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                                    {note.title}
                                  </h4>
                                </Link>

                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                                  {note.description}
                                </p>

                                {/* Keywords */}
                                {note.keywords && note.keywords.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-5">
                                    {note.keywords.slice(0, 4).map((kw) => (
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

                              {/* Quick Action Footer */}
                              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold">
                                <Link
                                  href={`/notes/${course}/${branch}/${noteSubjectSlug}/${note.slug}`}
                                  className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition flex items-center gap-1"
                                >
                                  <span>Read Note</span>
                                  <span>→</span>
                                </Link>

                                <div className="flex items-center gap-2 text-gray-400">
                                  <Link
                                    href="/mcqs"
                                    title="Practice MCQs for this topic"
                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    MCQs 📝
                                  </Link>
                                  <span>•</span>
                                  <Link
                                    href="/formulas"
                                    title="Open Live Formula Calculators"
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    Formulas 🧮
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
