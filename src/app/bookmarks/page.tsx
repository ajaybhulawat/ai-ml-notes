"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { BookmarkItem } from "@/components/BookmarkButton"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("bookmarked_notes")
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  function handleRemove(item: BookmarkItem) {
    const updated = bookmarks.filter(
      (b) => !(b.course === item.course && b.branch === item.branch && b.slug === item.slug)
    )
    setBookmarks(updated)
    localStorage.setItem("bookmarked_notes", JSON.stringify(updated))
  }

  function handleClearAll() {
    setBookmarks([])
    localStorage.removeItem("bookmarked_notes")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8 border-b dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">
              Saved Bookmarks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Quick access to your saved study guides and exam notes ({bookmarks.length} saved).
            </p>
          </div>

          {bookmarks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-3">🔖</span>
            <p className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">No Bookmarks Saved Yet</p>
            <p className="text-sm mb-6 text-gray-400 dark:text-gray-500 max-w-md mx-auto">
              Click the &ldquo;🔖 Bookmark&rdquo; button on any note page to save it here for fast revision.
            </p>
            <Link
              href="/notes"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
            >
              Browse Notes →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookmarks.map((note) => (
              <div
                key={`${note.course}-${note.branch}-${note.slug}`}
                className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                      {note.course} / {note.branch}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{note.unit}</span>
                  </div>

                  <Link
                    href={`/notes/${note.course}/${note.branch}/${note.slug}`}
                    className="group"
                  >
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2">
                      {note.title}
                    </h2>
                  </Link>

                  {note.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                      {note.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800 mt-4">
                  <Link
                    href={`/notes/${note.course}/${note.branch}/${note.slug}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Read note →
                  </Link>

                  <button
                    onClick={() => handleRemove(note)}
                    className="text-xs text-gray-400 hover:text-rose-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
