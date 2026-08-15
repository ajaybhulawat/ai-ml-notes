import Link from "next/link"
import { getBranches, getAllCourses } from "@/lib/notes"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ course: string }>
}

const branchLabels: Record<string, string> = {
  cse: "Computer Science Engineering",
  ece: "Electronics & Communication Engineering",
  civil: "Civil Engineering",
  mech: "Mechanical Engineering",
  it: "Information Technology",
  eee: "Electrical & Electronics Engineering",
}

export async function generateStaticParams() {
  const courses = getAllCourses()
  return courses.map((course) => ({ course }))
}

export default async function CoursePage({ params }: Props) {
  const { course } = await params
  const branches = getBranches(course)

  if (branches.length === 0) return notFound()

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/notes" className="hover:text-indigo-600 transition">Notes</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{course.toUpperCase()}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        {course.toUpperCase()} — Select Branch
      </h1>
      <p className="text-gray-500 mb-10 text-lg">
        Choose your branch to view organized AI &amp; ML notes.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <Link
            key={branch}
            href={`/notes/${course}/${branch}`}
            className="group flex flex-col justify-between bg-white border rounded-2xl p-6 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 mb-3 uppercase tracking-wide">
                {branch.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                {branchLabels[branch] ?? branch.toUpperCase()}
              </h2>
              <p className="text-gray-500 text-sm">
                Explore all AI &amp; ML notes for {branch.toUpperCase()} students.
              </p>
            </div>
            <div className="mt-4 text-sm font-medium text-indigo-600 group-hover:underline">
              View notes →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
