import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllSlugs, getNoteBySlug, getAllNotesMeta } from "@/lib/notes"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import PrintButton from "@/components/PrintButton"
import BookmarkButton from "@/components/BookmarkButton"

type Props = {
  params: Promise<{
    course: string
    branch: string
    slug: string
  }>
}

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, branch, slug } = await params
  const note = await getNoteBySlug(course, branch, slug)

  if (!note) return { title: "Note Not Found" }

  return {
    title: note.title,
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

export default async function NotePage({ params }: Props) {
  const { course, branch, slug } = await params

  if (!course || !branch || !slug) return notFound()

  const note = await getNoteBySlug(course, branch, slug)
  const allNotes = getAllNotesMeta()

  if (!note) return notFound()

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
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

  const bookmarkData = {
    course,
    branch,
    slug,
    title: note.title,
    unit: note.unit,
    description: note.description,
  }

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="no-print">
        <Navbar allNotes={allNotes} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Main Content Column */}
        <article className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="no-print text-sm text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Notes</Link>
            <span>›</span>
            <Link href={`/notes/${course}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{course.toUpperCase()}</Link>
            <span>›</span>
            <Link href={`/notes/${course}/${branch}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{branch.toUpperCase()}</Link>
            <span>›</span>
            <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{note.title}</span>
          </nav>

          {/* Unit Badge + Actions Bar */}
          <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full uppercase tracking-wide">
              {note.unit}
            </span>
            <div className="flex items-center gap-2">
              <BookmarkButton note={bookmarkData} />
              <PrintButton />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            {note.title}
          </h1>

          {/* Description */}
          {note.description && (
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 border-l-4 border-indigo-400 pl-4 bg-indigo-50/50 dark:bg-indigo-950/30 py-2 rounded-r-lg">
              {note.description}
            </p>
          )}

          {/* Divider */}
          <hr className="mb-8 border-gray-200 dark:border-gray-800" />

          {/* Markdown Content */}
          <div
            className="prose prose-lg prose-indigo dark:prose-invert max-w-none 
              prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 dark:prose-h2:border-gray-800
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-table:w-full prose-table:border-collapse
              prose-th:bg-indigo-50 dark:prose-th:bg-indigo-950/40 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border dark:prose-th:border-gray-800
              prose-td:p-3 prose-td:border dark:prose-td:border-gray-800 prose-blockquote:border-l-indigo-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {/* Footer Navigation */}
          <div className="no-print mt-16 pt-8 border-t dark:border-gray-800 flex justify-between items-center">
            <Link
              href={`/notes/${course}/${branch}`}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              ← Back to {branch.toUpperCase()} Notes
            </Link>
            <Link
              href="/notes"
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              All Courses →
            </Link>
          </div>
        </article>

        {/* Table of Contents Sticky Sidebar */}
        {note.headings.length > 0 && (
          <aside className="no-print w-full lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                <span>📑</span> On this page
              </h3>
              <nav className="space-y-2 text-sm">
                {note.headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block transition hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 ${
                      h.level === 3
                        ? "pl-4 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        : "font-medium text-gray-700 dark:text-gray-200"
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
    </>
  )
}