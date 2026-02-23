"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Note = {
  slug: string
  title: string
  unit: string
}

export default function Sidebar({
  groupedNotes,
}: {
  groupedNotes: Record<string, Note[]>
}) {

  const pathname = usePathname()

  return (
    <aside className="w-64 border-r p-6 bg-white sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">AI/ML Notes</h2>

      <nav className="space-y-6">
        {Object.entries(groupedNotes).map(([unit, notes]) => (
          <div key={unit}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              {unit}
            </h3>

            <div className="space-y-2">
              {notes.map((note) => {
                const isActive =
                  pathname === `/notes/${note.slug}`

                return (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.slug}`}
                    className={`block px-3 py-2 rounded-md text-sm transition ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100"
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