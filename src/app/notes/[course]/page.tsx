import Link from "next/link"
import { getBranches, getAllCourses, getNotesForBranch, getAllNotesMeta } from "@/lib/notes"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"

type Props = {
  params: Promise<{ course: string }>
}

const branchLabels: Record<string, string> = {
  cse: "Computer Science & Engineering",
  ece: "Electronics & Communication Engineering",
  civil: "Civil Engineering",
  mech: "Mechanical Engineering",
  it: "Information Technology",
  eee: "Electrical & Electronics Engineering",
}

const courseDetails: Record<
  string,
  { title: string; subtitle: string; description: string; emoji: string; semCount: number }
> = {
  btech: {
    title: "BTech AI & ML Study Notes",
    subtitle: "Bachelor of Technology — Computer Science & Engineering",
    description:
      "Comprehensive, exam-focused study guides for BTech engineering students. Covers core machine learning, supervised learning, and dimensionality reduction.",
    emoji: "📘",
    semCount: 8,
  },
  mtech: {
    title: "MTech AI & ML Study Notes",
    subtitle: "Master of Technology — Computer Science & Advanced Computing",
    description:
      "Advanced postgraduate study notes covering Deep Learning, Convolutional Neural Networks, Sequence Models (LSTM/GRU), and Probabilistic Graphical Models.",
    emoji: "🎓",
    semCount: 4,
  },
  ba: {
    title: "BA AI Theory Notes",
    subtitle: "Bachelor of Arts — Artificial Intelligence & Logic",
    description:
      "Foundational theoretical notes introducing human-centered AI concepts, logic, and ethical frameworks.",
    emoji: "📗",
    semCount: 6,
  },
  ma: {
    title: "MA AI Research Notes",
    subtitle: "Master of Arts — Advanced Theoretical AI",
    description:
      "Postgraduate research summaries and comparative analyses of artificial intelligence and machine learning models.",
    emoji: "📙",
    semCount: 4,
  },
}

export async function generateStaticParams() {
  const courses = getAllCourses()
  return courses.map((course) => ({ course }))
}

export default async function CoursePage({ params }: Props) {
  const { course } = await params
  const branches = getBranches(course)
  const allNotes = getAllNotesMeta()

  if (branches.length === 0) return notFound()

  const info = courseDetails[course.toLowerCase()] ?? {
    title: `${course.toUpperCase()} Study Notes`,
    subtitle: `${course.toUpperCase()} Degree Program`,
    description: `Exam study guides and structured notes for ${course.toUpperCase()} students.`,
    emoji: "📄",
    semCount: 8,
  }

  // Branch statistics
  const branchSummaries = branches.map((branch) => {
    const notes = getNotesForBranch(course, branch)
    const subjects = Array.from(new Set(notes.map((n) => n.subject).filter(Boolean)))
    const semesters = Array.from(new Set(notes.map((n) => n.semester).filter(Boolean)))

    return {
      branch,
      branchName: branchLabels[branch] ?? branch.toUpperCase(),
      noteCount: notes.length,
      subjects,
      semesters,
    }
  })

  // Course total notes
  const courseTotalNotes = branchSummaries.reduce((sum, b) => sum + b.noteCount, 0)

  // Semester breakdown list
  const semesterList = Array.from({ length: info.semCount }, (_, i) => {
    const semName = `Semester ${i + 1}`
    const matchingNotes = allNotes.filter((n) => n.course === course && n.semester === semName)
    return {
      semNumber: i + 1,
      semName,
      hasNotes: matchingNotes.length > 0,
      noteCount: matchingNotes.length,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar allNotes={allNotes} />

      {/* Hero Header */}
      <section className="relative border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
            <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Academic Notes
            </Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-gray-200 font-semibold">{course.toUpperCase()}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <span>{info.emoji}</span> {info.subtitle}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {info.title}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {info.description}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex md:flex-col gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 shrink-0 text-center">
              <div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {courseTotalNotes}
                </span>
                <span className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Notes
                </span>
              </div>
              <div className="border-l md:border-l-0 md:border-t border-gray-200 dark:border-gray-700 pl-3 md:pl-0 md:pt-2">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200">
                  {branches.length}
                </span>
                <span className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {branches.length === 1 ? "Branch" : "Branches"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-14">
        {/* Branch Selection Section */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Select Branch</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse engineering specializations under the {course.toUpperCase()} degree program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branchSummaries.map(({ branch, branchName, noteCount, subjects }) => (
              <Link
                key={branch}
                href={`/notes/${course}/${branch}`}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7 shadow-sm hover:shadow-xl dark:hover:border-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      {branch.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {noteCount} {noteCount === 1 ? "note" : "notes"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {branchName}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Access exam questions, definitions, formulas, and topic guides for {branchName}.
                  </p>

                  {/* Subjects list */}
                  {subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {subjects.map((sub) => (
                        <span
                          key={sub}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition">
                  <span>Explore Branch Notes</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Semester Navigation Breakdown */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Explore by Semester</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Filter study notes by academic semester for targeted syllabus revision.
            </p>
          </div>

          {semesterList.filter((s) => s.hasNotes).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {semesterList
                .filter((s) => s.hasNotes)
                .map(({ semName, noteCount }) => (
                  <div
                    key={semName}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                        {semName}
                      </span>
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {noteCount} {noteCount === 1 ? "Note" : "Notes"}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-3 inline-flex items-center gap-1">
                      <span>Available</span>
                      <span>✓</span>
                    </span>
                  </div>
                ))}
            </div>
          ) : null}

          {semesterList.some((s) => !s.hasNotes) && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 italic">
              More semesters coming soon.
            </p>
          )}
        </section>

        {/* Exam Preparation Guide Overview Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 md:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-indigo-200 border border-white/20">
              <span>🎯</span> Exam Strategy
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Exam-Ready Answer Formatting
            </h2>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
              Each topic guide is tailored for university examinations. Clear headers, step-by-step algorithms, mathematical proofs, and comparison tables ensure maximum marks in 2-mark definitions, 5-mark short answers, and 10-mark long questions.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-indigo-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 2-Mark Core Definitions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 5-Mark Short Notes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> 10-Mark Derivations &amp; Steps
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
