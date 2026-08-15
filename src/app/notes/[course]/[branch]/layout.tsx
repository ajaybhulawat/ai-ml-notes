import { getNotesForBranch } from "@/lib/notes"
import Sidebar from "@/components/Sidebar"

type Props = {
  children: React.ReactNode
  params: Promise<{ course: string; branch: string }>
}

export default async function BranchLayout({ children, params }: Props) {
  const { course, branch } = await params
  const notes = getNotesForBranch(course, branch)

  // Group by unit for the sidebar
  const grouped = notes.reduce<Record<string, typeof notes>>((acc, note) => {
    const unit = note.unit || "General"
    if (!acc[unit]) acc[unit] = []
    acc[unit].push(note)
    return acc
  }, {})

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar course={course} branch={branch} groupedNotes={grouped} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
