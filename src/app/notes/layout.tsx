import { getAllNotesMeta } from "@/lib/notes"
import Sidebar from "@/components/Sidebar"

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const notes = getAllNotesMeta()

  // Group by unit
  const grouped = notes.reduce((acc, note) => {
    const unit = note.unit || "Uncategorized"
    if (!acc[unit]) acc[unit] = []
    acc[unit].push(note)
    return acc
  }, {} as Record<string, typeof notes>)

  return (
    <div className="flex min-h-screen">
      <Sidebar groupedNotes={grouped} />
      <main className="flex-1 p-10">{children}</main>
    </div>
  )
}