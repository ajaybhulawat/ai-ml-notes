"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type NoteMeta = {
  course: string
  branch: string
  slug: string
  title: string
  description: string
  unit: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  allNotes: NoteMeta[]
}

export default function SearchModal({ isOpen, onClose, allNotes }: Props) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Filter notes based on query
  const filtered = query.trim()
    ? allNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.description.toLowerCase().includes(query.toLowerCase()) ||
          n.unit.toLowerCase().includes(query.toLowerCase()) ||
          n.course.toLowerCase().includes(query.toLowerCase()) ||
          n.branch.toLowerCase().includes(query.toLowerCase())
      )
    : []

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault()
        const target = filtered[selectedIndex]
        router.push(`/notes/${target.course}/${target.branch}/${target.slug}`)
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filtered, selectedIndex, router, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
          <span className="text-xl text-gray-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, topics, units... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="flex-1 bg-transparent text-gray-800 text-lg outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-600 bg-gray-200 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!query.trim() ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Type to search notes across all courses, branches, and units...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No notes found matching &ldquo;<span className="font-semibold text-gray-800">{query}</span>&rdquo;
            </div>
          ) : (
            filtered.map((note, index) => {
              const isSelected = index === selectedIndex
              return (
                <Link
                  key={`${note.course}-${note.branch}-${note.slug}`}
                  href={`/notes/${note.course}/${note.branch}/${note.slug}`}
                  onClick={onClose}
                  className={`block p-4 rounded-xl transition border ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                      : "bg-white border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600">
                      {note.title}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase">
                      {note.course} / {note.branch}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                    {note.description}
                  </p>

                  <div className="text-[11px] font-medium text-gray-400">
                    Unit: {note.unit}
                  </div>
                </Link>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-400">
          <div className="flex gap-3">
            <span><kbd className="bg-white border px-1 rounded">↑</kbd> <kbd className="bg-white border px-1 rounded">↓</kbd> Navigate</span>
            <span><kbd className="bg-white border px-1 rounded">↵</kbd> Select</span>
            <span><kbd className="bg-white border px-1 rounded">Esc</kbd> Close</span>
          </div>
          {filtered.length > 0 && (
            <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>
    </div>
  )
}
