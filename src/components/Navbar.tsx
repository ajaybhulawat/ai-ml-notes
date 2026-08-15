"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import SearchModal from "./SearchModal"
import ThemeToggle from "./ThemeToggle"

type NoteMeta = {
  course: string
  branch: string
  slug: string
  title: string
  description: string
  unit: string
}

export default function Navbar({ allNotes = [] }: { allNotes?: NoteMeta[] }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-bold text-indigo-900 dark:text-indigo-400">
              AI &amp; ML Exam Notes
            </h1>
          </Link>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-sm transition border border-transparent dark:border-gray-700"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Search notes...</span>
              <kbd className="hidden sm:inline bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-[10px] font-semibold text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded shadow-2xs">
                Ctrl K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 font-medium text-gray-700 dark:text-gray-300">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Exam Notes
            </Link>
            <Link href="/mcqs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1">
              <span>📝</span> MCQs
            </Link>
            <Link href="/formulas" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1">
              <span>🧮</span> Formulas
            </Link>
            <Link href="/bookmarks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1">
              <span>🔖</span> Bookmarks
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allNotes={allNotes}
      />
    </>
  )
}