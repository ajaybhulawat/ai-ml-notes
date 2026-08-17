import Link from "next/link"
import { getAllCourses, getNotesForBranch, getAllNotesMeta, getBranches } from "@/lib/notes"
import Navbar from "@/components/Navbar"

const courseConfig: Record<
  string,
  { label: string; fullName: string; color: string; description: string; emoji: string }
> = {
  btech: {
    label: "BTech",
    fullName: "Bachelor of Technology",
    color: "from-blue-500 to-cyan-500",
    description: "Foundational engineering study notes organized by branch and semester.",
    emoji: "📘",
  },
  mtech: {
    label: "MTech",
    fullName: "Master of Technology",
    color: "from-indigo-500 to-purple-500",
    description: "Advanced postgraduate engineering notes focusing on Deep Learning & AI.",
    emoji: "🎓",
  },
  ba: {
    label: "BA",
    fullName: "Bachelor of Arts",
    color: "from-emerald-500 to-teal-500",
    description: "Introductory notes covering AI/ML logic and theoretical basics.",
    emoji: "📗",
  },
  ma: {
    label: "MA",
    fullName: "Master of Arts",
    color: "from-rose-500 to-pink-500",
    description: "Advanced theoretical AI/ML research notes and comparative studies.",
    emoji: "📙",
  },
}

export default function NotesHomePage() {
  const courses = getAllCourses()
  const allNotes = getAllNotesMeta()

  // Compute course note counts and branch lists
  const courseSummaries = courses.map((course) => {
    const branches = getBranches(course)
    let totalNotes = 0
    const subjectsSet = new Set<string>()

    branches.forEach((branch) => {
      const notes = getNotesForBranch(course, branch)
      totalNotes += notes.length
      notes.forEach((n) => {
        if (n.subject) subjectsSet.add(n.subject)
      })
    })

    return {
      course,
      branches,
      totalNotes,
      subjects: Array.from(subjectsSet),
    }
  })

  // Group popular subjects
  const popularSubjects = [
    {
      name: "Machine Learning",
      code: "ML-301",
      course: "btech",
      branch: "cse",
      noteCount: allNotes.filter((n) => n.subject === "Machine Learning").length || 4,
      desc: "Supervised algorithms, regression, decision trees, SVM, and dimensionality reduction.",
      color: "from-blue-500 to-indigo-500",
      emoji: "📊",
    },
    {
      name: "Deep Learning",
      code: "DL-501",
      course: "mtech",
      branch: "cse",
      noteCount: allNotes.filter((n) => n.subject === "Deep Learning").length || 3,
      desc: "Neural network architectures, CNNs for vision, and RNNs/LSTMs for sequences.",
      color: "from-purple-500 to-pink-500",
      emoji: "🧠",
    },
    {
      name: "Advanced Artificial Intelligence",
      code: "AI-502",
      course: "mtech",
      branch: "cse",
      noteCount: allNotes.filter((n) => n.subject === "Advanced Artificial Intelligence").length || 2,
      desc: "Probabilistic graphical models, Bayesian belief networks, and logical reasoning.",
      color: "from-emerald-500 to-teal-500",
      emoji: "🌐",
    },
    {
      name: "Advanced Machine Learning",
      code: "AML-503",
      course: "mtech",
      branch: "cse",
      noteCount: allNotes.filter((n) => n.subject === "Advanced Machine Learning").length || 1,
      desc: "Unsupervised clustering algorithms, K-Means optimization, and latent feature extraction.",
      color: "from-amber-500 to-orange-500",
      emoji: "⚡",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar allNotes={allNotes} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 py-16 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent dark:from-indigo-950/30" />
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <span>📚</span> Academic Note Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Academic Study Notes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Exam-focused, structured engineering notes organized by course, branch, semester, and subject.
          </p>

          {/* Quick Search Shortcut Callout */}
          <div className="max-w-xl mx-auto">
            <Link
              href="/search"
              className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-md hover:shadow-lg rounded-2xl px-5 py-3.5 transition group"
            >
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <span className="text-xl">🔍</span>
                <span className="text-sm font-medium">Search notes by topic, keyword, or unit...</span>
              </div>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition">
                Search
              </span>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Course-First Navigation Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Select Course</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your degree program to access specialized subject notes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseSummaries.map(({ course, branches, totalNotes, subjects }) => {
              const config = courseConfig[course] ?? {
                label: course.toUpperCase(),
                fullName: `${course.toUpperCase()} Program`,
                color: "from-gray-400 to-gray-600",
                description: `Engineering notes for ${course.toUpperCase()} students.`,
                emoji: "📄",
              }

              return (
                <Link
                  key={course}
                  href={`/notes/${course}`}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7 shadow-sm hover:shadow-xl dark:hover:border-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.color}`} />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{config.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {config.label}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {config.fullName}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      {totalNotes} {totalNotes === 1 ? "Note" : "Notes"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                    {config.description}
                  </p>

                  {/* Branches & Subjects preview */}
                  <div className="space-y-2 mb-6 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Branches:</span>
                      <span>{branches.map((b) => b.toUpperCase()).join(", ") || "CSE"}</span>
                    </div>
                    {subjects.length > 0 && (
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Subjects:</span>
                        <span className="truncate">{subjects.join(" • ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition">
                    <span>Browse {config.label} Branches</span>
                    <span>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Popular Subjects Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Popular Subjects</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore core syllabus subjects organized by academic domain.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularSubjects.map((sub) => (
              <Link
                key={sub.name}
                href={`/notes/${sub.course}/${sub.branch}`}
                className="group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:border-indigo-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{sub.emoji}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {sub.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {sub.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span>{sub.course.toUpperCase()} · {sub.branch.toUpperCase()}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{sub.noteCount} notes</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Updated Notes Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recently Added &amp; Updated Notes</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest exam study guides, theoretical breakdowns, and algorithm notes.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Showing {allNotes.length} notes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNotes.map((note) => (
              <Link
                key={`${note.course}-${note.branch}-${note.slug}`}
                href={`/notes/${note.course}/${note.branch}/${note.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:border-indigo-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      {note.course} / {note.branch}
                    </span>
                    {note.unit && (
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[130px]">
                        {note.unit}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                    {note.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>{note.subject || "Machine Learning"}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition">
                    Read Note →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
