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

  const cleanDescription = note.description || note.title

  // Copy Answer helper
  const handleCopyAnswer = async () => {
    try {
      let copyText = `${note.title}\nSubject: ${note.subject || "Machine Learning"} | ${note.unit}\n\n`
      if (viewMode === "2mark") {
        copyText += `[2-Mark Definition]\nQ: Define ${note.title}?\nA: ${cleanDescription}`
      } else if (viewMode === "5mark") {
        copyText += `[5-Mark Short Summary]\n${cleanDescription}\n\nKey Subtopics:\n` +
          (note.headings.map((h) => `• ${h.text}`).slice(0, 5).join("\n") || "• Core Definition and Mathematical Foundation")
      } else {
        copyText += `[10-Mark Detailed Answer]\n${cleanDescription}\n\nKey Concepts:\n` +
          note.headings.map((h) => `• ${h.text}`).join("\n")
      }

      await navigator.clipboard.writeText(copyText)
      showToast("✅ Copied answer to clipboard!")
    } catch {
      showToast("❌ Unable to copy answer")
    }
  }

  // Share helper
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
      // User closed share window
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
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-bounce transition">
          {toastMessage}
        </div>
      )}

      {/* Exam Navigation & Toolbar Area */}
      <div className="no-print sticky top-16 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-3 shadow-xs space-y-3">
        {/* Anchor Quick Jump Tabs + Format View Switcher */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none text-xs font-bold">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline mr-1">
              Format:
            </span>
            <button
              onClick={() => setViewMode("full")}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1 ${
                viewMode === "full"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>📖</span> Full Note
            </button>

            <button
              onClick={() => setViewMode("2mark")}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1 ${
                viewMode === "2mark"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>⚡</span> 2 Marks
            </button>

            <button
              onClick={() => setViewMode("5mark")}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1 ${
                viewMode === "5mark"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>📝</span> 5 Marks
            </button>

            <button
              onClick={() => setViewMode("10mark")}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1 ${
                viewMode === "10mark"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>🎯</span> 10 Marks
            </button>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyAnswer}
              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition border border-gray-200 dark:border-gray-700"
              title="Copy answer summary to clipboard"
            >
              <span>📋</span> <span className="hidden sm:inline">Copy Answer</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition border border-gray-200 dark:border-gray-700"
              title="Share topic link"
            >
              <span>🔗</span> <span className="hidden sm:inline">Share</span>
            </button>

            <BookmarkButton note={bookmarkData} />
            <PrintButton />
          </div>
        </div>

        {/* Section Jump Anchors Bar */}
        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-2 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-gray-400 font-bold uppercase tracking-wider">
            Jump to:
          </span>
          <a
            href="#definition"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition whitespace-nowrap"
          >
            Definition
          </a>
          <a
            href="#2-mark"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition whitespace-nowrap"
          >
            2-Mark Q&amp;A
          </a>
          <a
            href="#5-mark"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition whitespace-nowrap"
          >
            5-Mark Notes
          </a>
          <a
            href="#10-mark"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition whitespace-nowrap"
          >
            10-Mark Derivation
          </a>
          <a
            href="#quick-revision"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition whitespace-nowrap ml-auto"
          >
            ⚡ Quick Revision
          </a>
        </div>
      </div>

      {/* Main Topic Exam Content Display */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xs">
        {/* 2-MARK SPECIALIZED VIEW */}
        {viewMode === "2mark" && (
          <div id="2-mark" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span>⚡</span> 2-Mark Exam Quick Answer
              </div>
              <button
                onClick={handleCopyAnswer}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>📋</span> Copy Answer
              </button>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Q: Define {note.title}?
              </h3>
              <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                {cleanDescription}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <span className="font-bold text-gray-800 dark:text-gray-200">💡 University Exam Tip:</span>
              <p>State the exact 1-sentence definition above, state the mathematical metric (if applicable), and list 2 key components for maximum 2-mark credit.</p>
            </div>
          </div>
        )}

        {/* 5-MARK SPECIALIZED VIEW */}
        {viewMode === "5mark" && (
          <div id="5-mark" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <span>📝</span> 5-Mark Short Answer Format
              </div>
              <button
                onClick={handleCopyAnswer}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>📋</span> Copy 5-Mark Summary
              </button>
            </div>
            <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Short Note: {note.title}
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                {cleanDescription}
              </p>
              <div className="space-y-2 pt-2 border-t border-amber-200/50 dark:border-amber-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Essential Subtopics &amp; Algorithm Steps:
                </h4>
                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  {note.headings.length > 0 ? (
                    note.headings.slice(0, 6).map((h) => (
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
                        <span>Algorithm Construction Steps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>Real-world Applications &amp; Advantages</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FULL NOTE OR 10-MARK DETAILED VIEW */}
        {(viewMode === "full" || viewMode === "10mark") && (
          <div>
            {viewMode === "10mark" && (
              <div id="10-mark" className="mb-6 flex items-center justify-between border-b border-purple-100 dark:border-purple-900/50 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <span>🎯</span> 10-Mark Detailed Answer &amp; Numerical Derivation
                </div>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  Comprehensive Exam Guide
                </span>
              </div>
            )}

            {/* Markdown Rendered Content with responsive tables & math */}
            <div
              className="prose prose-lg prose-indigo dark:prose-invert max-w-none 
                prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 dark:prose-h2:border-gray-800
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-li:text-gray-700 dark:prose-li:text-gray-300 
                overflow-x-auto
                prose-table:w-full prose-table:my-6 prose-table:border-collapse prose-table:text-sm
                prose-th:bg-indigo-50/80 dark:prose-th:bg-indigo-950/40 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:border dark:prose-th:border-gray-800
                prose-td:p-3 prose-td:border dark:prose-td:border-gray-800
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/40 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-200"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
