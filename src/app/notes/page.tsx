import Link from "next/link"
import { getAllCourses } from "@/lib/notes"

const courseConfig: Record<string, { label: string; color: string; description: string; emoji: string }> = {
  mtech: {
    label: "MTech",
    color: "from-indigo-500 to-purple-500",
    description: "Master of Technology — Advanced engineering notes by branch.",
    emoji: "🎓",
  },
  btech: {
    label: "BTech",
    color: "from-blue-500 to-cyan-500",
    description: "Bachelor of Technology — Foundational engineering notes by branch.",
    emoji: "📘",
  },
  ba: {
    label: "BA",
    color: "from-emerald-500 to-teal-500",
    description: "Bachelor of Arts — Notes on AI/ML theory and humanities.",
    emoji: "📗",
  },
  ma: {
    label: "MA",
    color: "from-rose-500 to-pink-500",
    description: "Master of Arts — Advanced AI/ML studies and research notes.",
    emoji: "📙",
  },
}

export default function NotesHomePage() {
  const courses = getAllCourses()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-white to-purple-100 animate-gradient" />
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />

      {/* Hero */}
      <div className="text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Academic Notes Platform
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Structured AI &amp; ML notes organized by course, branch, and topic.
        </p>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-20 max-w-5xl mx-auto">
        {courses.map((course) => {
          const config = courseConfig[course] ?? {
            label: course.toUpperCase(),
            color: "from-gray-400 to-gray-600",
            description: `Notes for ${course.toUpperCase()} students.`,
            emoji: "📄",
          }

          return (
            <Link
              key={course}
              href={`/notes/${course}`}
              className="group relative overflow-hidden rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-md border"
            >
              {/* Gradient Top Bar */}
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${config.color}`} />

              <div className="mb-4 text-4xl">{config.emoji}</div>

              <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-600 transition">
                {config.label}
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed">{config.description}</p>

              <div className="mt-6 text-sm font-medium text-indigo-600 group-hover:underline">
                Browse branches →
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
