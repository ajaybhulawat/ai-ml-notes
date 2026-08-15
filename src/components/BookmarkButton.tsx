"use client"

import { useState, useEffect } from "react"

export type BookmarkItem = {
  course: string
  branch: string
  slug: string
  title: string
  unit: string
  description?: string
}

export default function BookmarkButton({ note }: { note: BookmarkItem }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("bookmarked_notes")
    if (saved) {
      try {
        const bookmarks: BookmarkItem[] = JSON.parse(saved)
        setIsBookmarked(
          bookmarks.some(
            (b) => b.course === note.course && b.branch === note.branch && b.slug === note.slug
          )
        )
      } catch (e) {
        console.error("Error reading bookmarks:", e)
      }
    }
  }, [note])

  function toggleBookmark() {
    const saved = localStorage.getItem("bookmarked_notes")
    let bookmarks: BookmarkItem[] = []
    if (saved) {
      try {
        bookmarks = JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }

    if (isBookmarked) {
      bookmarks = bookmarks.filter(
        (b) => !(b.course === note.course && b.branch === note.branch && b.slug === note.slug)
      )
      setIsBookmarked(false)
    } else {
      bookmarks.push(note)
      setIsBookmarked(true)
    }

    localStorage.setItem("bookmarked_notes", JSON.stringify(bookmarks))
  }

  return (
    <button
      onClick={toggleBookmark}
      className={`no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
        isBookmarked
          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
      title={isBookmarked ? "Remove from Bookmarks" : "Bookmark this Note"}
    >
      <span>{isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}</span>
    </button>
  )
}
