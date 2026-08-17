import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  getAllSubjectTopicParams,
  getNoteBySlug,
  getAllNotesMeta,
  getNotesForBranch,
  slugifySubject,
} from "@/lib/notes"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import TopicExamView from "@/components/TopicExamView"

type Props = {
  params: Promise<{
    course: string
    branch: string
    subject: string
    slug: string
  }>
}

export async function generateStaticParams() {
  return getAllSubjectTopicParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, branch, subject, slug } = await params
  const note = await getNoteBySlug(course, branch, slug)

  if (!note) return { title: "Note Not Found" }

  const subjectName = note.subject || subject.replace(/-/g, " ")

  return {
    title: `${note.title} | ${subjectName} 10-Mark Exam Answer & Notes (${course.toUpperCase()} ${branch.toUpperCase()})`,
    description: note.description,
    openGraph: {
      title: `${note.title} — ${subjectName} (${course.toUpperCase()} ${branch.toUpperCase()})`,
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

export default async function SubjectTopicPage({ params }: Props) {
  const { course, branch, subject, slug } = await params

  if (!course || !branch || !slug) return notFound()

  const note = await getNoteBySlug(course, branch, slug)
  const allNotes = getAllNotesMeta()
  const branchNotes = getNotesForBranch(course, branch)

  if (!note) return notFound()

  const subjectDisplayName = note.subject || subject.replace(/-/g, " ")
  const subjectSlug = slugifySubject(subjectDisplayName)

  // Related Topics calculation
  let relatedNotes = allNotes.filter((n) => {
    if (n.slug === slug) return false
    if (note.relatedSlugs && note.relatedSlugs.includes(n.slug)) return true
    return n.course === course && n.branch === branch && n.unit === note.unit
  }).slice(0, 3)

  if (relatedNotes.length === 0) {
    relatedNotes = branchNotes.filter((n) => n.slug !== slug).slice(0, 3)
  }

  // Syllabus-ordered Previous & Next topic navigation
  const currentIndex = branchNotes.findIndex((n) => n.slug === slug)
  const previousNote = currentIndex > 0 ? branchNotes[currentIndex - 1] : null
  const nextNote = currentIndex >= 0 && currentIndex < branchNotes.length - 1 ? branchNotes[currentIndex + 1] : null

  // JSON-LD Structured Data (TechArticle + BreadcrumbList)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes.vercel.app"

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
        name: "Academic Notes",
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
        item: `${baseUrl}/notes/${course}/${branch}/${subjectSlug}/${slug}`,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD Schemas */}
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
          {/* Main Content Column */}
          <article className="flex-1 min-w-0 space-y-6">
            {/* 5-Level Breadcrumb Navigation with Active Internal Links */}
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

            {/* Topic Header & Metadata Bar */}
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

            {/* Exam Format Switcher & Content Component */}
            <TopicExamView note={note} />

            {/* Related Topics Section */}
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

            {/* Syllabus-ordered Previous / Next Navigation Controls */}
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

          {/* Table of Contents Sticky Sidebar */}
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
