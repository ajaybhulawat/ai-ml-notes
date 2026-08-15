"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Note = {
  slug: string
  title: string
  unit: string
  course: string
  branch: string
}

type Props = {
  course: string
  branch: string
  groupedNotes: Record<string, Note[]>
}

export default function Sidebar({ course, branch, groupedNotes }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 border-r bg-white sticky top-0 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-5 border-b">
        <Link
          href={`/notes/${course}/${branch}`}
          className="text-xs font-semibold text-indigo-600 uppercase tracking-widest hover:underline"
        >
          ← All Notes
        </Link>
        <h2 className="text-base font-bold mt-1 text-gray-800">
          {branch.toUpperCase()} — {course.toUpperCase()}
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-5">
        {Object.entries(groupedNotes).map(([unit, notes]) => (
          <div key={unit}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              {unit}
            </h3>
            <div className="space-y-1">
              {notes.map((note) => {
                const href = `/notes/${course}/${branch}/${note.slug}`
                const isActive = pathname === href

                return (
                  <Link
                    key={note.slug}
                    href={href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {note.title}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}