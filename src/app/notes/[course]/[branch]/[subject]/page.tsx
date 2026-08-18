import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  getSubjectBySlug,
  getAllSubjectParams,
  getAllNotesMeta,
  getNotesForBranch,
  getNoteBySlug,
  getAllSlugs,
  slugifySubject,
  getUnitNumber,
  pluralize,
} from "@/lib/notes"
import Navbar from "@/components/Navbar"
import TopicExamView from "@/components/TopicExamView"

type Props = {
  params: Promise<{ course: string; branch: string; subject: string }>
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
  const subjectParams = getAllSubjectParams()
  const topicSlugs = getAllSlugs().map((item) => ({
    course: item.course,
    branch: item.branch,
    subject: item.slug,
  }))

  return [...subjectParams, ...topicSlugs]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, branch, subject: paramSubject } = await params

  // 1. Check if paramSubject is a topic note slug
  const note = await getNoteBySlug(course, branch, paramSubject)
  if (note) {
    const subjectName = note.subject || "Machine Learning"
    return {
      title: `${note.title} | ${subjectName} 10-Mark Exam Answer & Notes (${course.toUpperCase()} ${branch.toUpperCase()})`,
      description: note.description,
      openGraph: {
        title: `${note.title} (${course.toUpperCase()} ${branch.toUpperCase()})`,
        description: note.description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: note.title,
        description: note.description,
      },
    }
  }

  // 2. Check if paramSubject is a subject slug
  const subjectObj = getSubjectBySlug(course, branch, paramSubject)
  if (subjectObj) {
    const branchName = branchLabels[branch.toLowerCase()] ?? branch.toUpperCase()
    return {
      title: `${subjectObj.subject} Notes | ${course.toUpperCase()} ${branch.toUpperCase()}`,
      description: `Complete exam study guides, unit notes, definitions, formulas, and topic guides for ${subjectObj.subject} (${branchName}).`,
      openGraph: {
        title: `${subjectObj.subject} Study Notes — ${course.toUpperCase()} ${branch.toUpperCase()}`,
        description: `Comprehensive syllabus notes, unit guides, and exam answers for ${subjectObj.subject}.`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${subjectObj.subject} Notes`,
        description: `Exam notes for ${subjectObj.subject}.`,
      },
    }
  }

  return { title: "Page Not Found" }
}

export default async function SubjectOrTopicPage({ params }: Props) {
  const { course, branch, subject: paramSubject } = await params
  const allNotes = getAllNotesMeta()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes.vercel.app"

  // -------------------------------------------------------------
  // BRANCH A: Handle Legacy Topic Note URL (/notes/btech/cse/decision-trees)
  // -------------------------------------------------------------
  const note = await getNoteBySlug(course, branch, paramSubject)
  if (note) {
    const branchNotes = getNotesForBranch(course, branch)
    const subjectDisplayName = note.subject || "Machine Learning"
    const subjectSlug = slugifySubject(subjectDisplayName)

    let relatedNotes = allNotes.filter((n) => {
      if (n.slug === paramSubject) return false
      if (note.relatedSlugs && note.relatedSlugs.includes(n.slug)) return true
      return n.course === course && n.branch === branch && n.unit === note.unit
    }).slice(0, 3)

    if (relatedNotes.length === 0) {
      relatedNotes = branchNotes.filter((n) => n.slug !== paramSubject).slice(0, 3)
    }

    const currentIndex = branchNotes.findIndex((n) => n.slug === paramSubject)
    const previousNote = currentIndex > 0 ? branchNotes[currentIndex - 1] : null
    const nextNote = currentIndex >= 0 && currentIndex < branchNotes.length - 1 ? branchNotes[currentIndex + 1] : null

    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: note.title,
      description: note.description,
      articleSection: note.unit,
      inLanguage: "en-US",
      educationalLevel: course.toUpperCase(),
      about: {
        "@type": "Thing",
        name: note.title,
      },
    }

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Notes",
          item: `${baseUrl}/notes`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: course.toUpperCase(),
          item: `${baseUrl}/notes/${course}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: branch.toUpperCase(),
          item: `${baseUrl}/notes/${course}/${branch}`,
        },
        {
          "@type": "ListItem",
          position: 5,
          name: subjectDisplayName,
          item: `${baseUrl}/notes/${course}/${branch}/${subjectSlug}`,
        },
        {
          "@type": "ListItem",
          position: 6,
          name: note.title,
          item: `${baseUrl}/notes/${course}/${branch}/${paramSubject}`,
        },
      ],
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <div className="no-print">
          <Navbar allNotes={allNotes} />
        </div>

        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-10">
            <article className="flex-1 min-w-0 space-y-6">
              <nav className="no-print text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Home
                </Link>
                <span>›</span>
                <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Notes
                </Link>
                <span>›</span>
                <Link href={`/notes/${course}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  {course.toUpperCase()}
                </Link>
                <span>›</span>
                <Link href={`/notes/${course}/${branch}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  {branch.toUpperCase()}
                </Link>
                <span>›</span>
                <Link href={`/notes/${course}/${branch}/${subjectSlug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  {subjectDisplayName}
                </Link>
                <span>›</span>
                <span className="text-gray-900 dark:text-gray-200 font-semibold truncate max-w-xs">{note.title}</span>
              </nav>

              <header className="space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <Link
                    href={`/notes/${course}/${branch}/${subjectSlug}`}
                    className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 hover:underline"
                  >
                    {subjectDisplayName}
                  </Link>
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {note.unit}
                  </span>
                  {note.semester && (
                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                      {note.semester}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wide">
                    {course.toUpperCase()} · {branch.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {note.title}
                </h1>

                {note.description && (
                  <p className="text-base text-gray-600 dark:text-gray-300 border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-r-lg">
                    {note.description}
                  </p>
                )}

                {note.keywords && note.keywords.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-gray-100 dark:border-gray-800">
                    {note.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <TopicExamView note={note} />

              {relatedNotes.length > 0 && (
                <section className="no-print pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🔗</span> Related Exam Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedNotes.map((rel) => {
                      const relSubjectSlug = slugifySubject(rel.subject || subjectDisplayName)
                      return (
                        <Link
                          key={rel.slug}
                          href={`/notes/${rel.course}/${rel.branch}/${relSubjectSlug}/${rel.slug}`}
                          className="group p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                              {rel.unit}
                            </span>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                              {rel.title}
                            </h4>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-3 group-hover:translate-x-1 transition">
                            Read →
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}

              <div className="no-print pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
                {previousNote ? (
                  <Link
                    href={`/notes/${course}/${branch}/${slugifySubject(previousNote.subject || subjectDisplayName)}/${previousNote.slug}`}
                    className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition text-left max-w-[48%]"
                  >
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      ← Previous Topic
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                      {previousNote.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextNote && (
                  <Link
                    href={`/notes/${course}/${branch}/${slugifySubject(nextNote.subject || subjectDisplayName)}/${nextNote.slug}`}
                    className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition text-right max-w-[48%] ml-auto"
                  >
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      Next Topic →
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                      {nextNote.title}
                    </span>
                  </Link>
                )}
              </div>

              {/* Parent Subject CTA */}
              <div className="no-print pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                <Link
                  href={`/notes/${course}/${branch}/${subjectSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold text-sm transition"
                >
                  <span>📘</span> Back to {subjectDisplayName} Notes
                </Link>
              </div>
            </article>

            {note.headings.length > 0 && (
              <aside className="no-print w-full lg:w-64 shrink-0">
                <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span>📑</span> Table of Contents
                  </h3>
                  <nav className="space-y-2 text-xs">
                    {note.headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block transition hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 ${
                          h.level === 3
                            ? "pl-3 text-[11px] text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            : "font-semibold text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </>
    )
  }

  // -------------------------------------------------------------
  // BRANCH B: Handle Subject Landing Page URL (/notes/btech/cse/machine-learning)
  // -------------------------------------------------------------
  const subjectObj = getSubjectBySlug(course, branch, paramSubject)
  if (!subjectObj) return notFound()

  const branchName = branchLabels[branch.toLowerCase()] ?? branch.toUpperCase()

  const unitsMap: Record<string, typeof subjectObj.notes> = {}
  subjectObj.notes.forEach((n) => {
    const unit = n.unit || "General Unit"
    if (!unitsMap[unit]) unitsMap[unit] = []
    unitsMap[unit].push(n)
  })

  const semesters = Array.from(new Set(subjectObj.notes.map((n) => n.semester).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar allNotes={allNotes} />

      <section className="relative border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <span>›</span>
            <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Notes
            </Link>
            <span>›</span>
            <Link href={`/notes/${course}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              {course.toUpperCase()}
            </Link>
            <span>›</span>
            <Link href={`/notes/${course}/${branch}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              {branch.toUpperCase()}
            </Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-gray-200 font-semibold">{subjectObj.subject}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  📘 Subject Notes
                </span>
                {semesters.map((sem) => (
                  <span key={sem} className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    {sem}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {subjectObj.subject}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Exam study guides, formula breakdowns, step-by-step algorithms, and unit notes for {subjectObj.subject} ({branchName}).
              </p>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 shrink-0 text-center">
              <div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {subjectObj.notes.length}
                </span>
                <span className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {pluralize(subjectObj.notes.length, "Topic Note", "Topic Notes").replace(/^\d+\s*/, "")}
                </span>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200">
                  {Object.keys(unitsMap).length}
                </span>
                <span className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {pluralize(Object.keys(unitsMap).length, "Unit", "Units").replace(/^\d+\s*/, "")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        <section className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <span>⚡ Subject Tools:</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px]">
              {course.toUpperCase()} · {branch.toUpperCase()}
            </span>
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
              <span>🧮</span> Formula Sheet
            </Link>
          </div>
        </section>

        <section className="space-y-10">
          {Object.entries(unitsMap)
            .sort(([unitA], [unitB]) => getUnitNumber(unitA) - getUnitNumber(unitB))
            .map(([unitName, unitNotes]) => (
            <div key={unitName} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>{unitName}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {unitNotes.map((n) => (
                  <div
                    key={n.slug}
                    className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg dark:hover:border-indigo-700 transition duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                          {unitName}
                        </span>
                        {n.semester && (
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                            {n.semester}
                          </span>
                        )}
                      </div>

                      <Link href={`/notes/${course}/${branch}/${slugifySubject(n.subject || subjectObj.subject)}/${n.slug}`}>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                          {n.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                        {n.description}
                      </p>

                      {n.keywords && n.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {n.keywords.slice(0, 4).map((kw) => (
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

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold">
                      <Link
                        href={`/notes/${course}/${branch}/${slugifySubject(n.subject || subjectObj.subject)}/${n.slug}`}
                        className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition flex items-center gap-1"
                      >
                        <span>Read Topic Guide</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
