"use client"

import { useState } from "react"
import PrintButton from "./PrintButton"
import BookmarkButton from "./BookmarkButton"

type Heading = {
  id: string
  text: string
  level: number
}

type NoteData = {
  course: string
  branch: string
  slug: string
  title: string
  description: string
  unit: string
  subject?: string
  semester?: string
  keywords?: string[]
  content: string
  headings: Heading[]
}

type Props = {
  note: NoteData
}

type ViewMode = "full" | "2mark" | "5mark" | "10mark"

export default function TopicExamView({ note }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("full")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  // Extract clean text snippet for 2-mark & 5-mark views
  const cleanDescription = note.description || note.title

  // Copy Answer helper
  const handleCopyAnswer = async () => {
    try {
      let copyText = `${note.title}\nSubject: ${note.subject || "Machine Learning"} | ${note.unit}\n\n`
      if (viewMode === "2mark") {
        copyText += `[2-Mark Definition]\n${cleanDescription}`
      } else if (viewMode === "5mark") {
        copyText += `[5-Mark Short Summary]\n${cleanDescription}\n\nKey Concepts:\n` +
          (note.headings.map(h => `• ${h.text}`).slice(0, 5).join("\n") || "• Fundamentals and Core Applications")
      } else {
        copyText += `${cleanDescription}\n\nSee full guide on AI & ML Notes platform.`
      }

      await navigator.clipboard.writeText(copyText)
      showToast("✅ Copied to clipboard!")
    } catch {
      showToast("❌ Unable to copy")
    }
  }

  // Share Topic helper
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: note.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        showToast("🔗 Page link copied!")
      }
    } catch {
      // User cancelled share dialog
    }
  }

  const bookmarkData = {
    course: note.course,
    branch: note.branch,
    slug: note.slug,
    title: note.title,
    unit: note.unit,
    description: note.description,
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-bounce transition">
          {toastMessage}
        </div>
      )}

      {/* Exam Format Switcher + Action Bar Container */}
      <div className="no-print bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setViewMode("full")}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === "full"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>📖</span> Full Note
          </button>

          <button
            onClick={() => setViewMode("2mark")}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === "2mark"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>⚡</span> 2-Mark Answer
          </button>

          <button
            onClick={() => setViewMode("5mark")}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === "5mark"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>📝</span> 5-Mark Answer
          </button>

          <button
            onClick={() => setViewMode("10mark")}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === "10mark"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>🎯</span> 10-Mark Answer
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800 shrink-0">
          <button
            onClick={handleCopyAnswer}
            className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl transition border border-gray-200 dark:border-gray-700"
            title="Copy answer summary to clipboard"
          >
            <span>📋</span> Copy
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl transition border border-gray-200 dark:border-gray-700"
            title="Share topic link"
          >
            <span>🔗</span> Share
          </button>

          <BookmarkButton note={bookmarkData} />
          <PrintButton />
        </div>
      </div>

      {/* Rendered View Mode Content */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xs">
        {viewMode === "2mark" && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span>⚡</span> 2-Mark Quick Exam Answer
            </div>
            <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Q: Define {note.title}?
              </h3>
              <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                {cleanDescription}
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              💡 Tip: Include the definition above and key mathematical symbols for full 2 marks.
            </div>
          </div>
        )}

        {viewMode === "5mark" && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <span>📝</span> 5-Mark Short Answer Format
            </div>
            <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Short Note on {note.title}
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                {cleanDescription}
              </p>
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Key Points &amp; Subtopics to Include:
                </h4>
                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  {note.headings.length > 0 ? (
                    note.headings.slice(0, 5).map((h) => (
                      <li key={h.id} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{h.text}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>Core Definition and Mathematical Foundation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>Algorithm Steps &amp; Parameters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>Real-world Applications &amp; Limitations</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {(viewMode === "full" || viewMode === "10mark") && (
          <div>
            {viewMode === "10mark" && (
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <span>🎯</span> 10-Mark Detailed Derivation &amp; Comprehensive Answer
              </div>
            )}
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
          </div>
        )}
      </div>
    </div>
  )
}
