import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50/60 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 md:py-24 border-b dark:border-gray-800 transition-colors">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Text & CTA */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span>✨</span> Verified Academic Curriculum
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-6">
            AI &amp; ML <span className="text-indigo-600 dark:text-indigo-400">Exam Notes</span> Made Simple
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Easy &amp; Detailed Study Guides for BTech &amp; MTech Students. Master complex AI algorithms, formulas, and diagrams for high exam scores.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/notes"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition active:scale-95"
            >
              Get Started
            </Link>

            <Link
              href="/notes"
              className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-gray-800 px-7 py-4 rounded-xl font-bold text-base shadow-xs transition"
            >
              Download PDF Notes
            </Link>
          </div>
        </div>

        {/* Right Robot Graduate Illustration Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl text-white overflow-hidden border border-indigo-400/30">
            {/* Background Diagram Overlays */}
            <div className="absolute top-4 right-4 opacity-20 text-7xl font-mono">
              ⚡
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Graduate Robot Icon Badge */}
              <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center text-6xl shadow-inner mb-6 animate-pulse">
                🤖🎓
              </div>

              <h3 className="text-2xl font-bold mb-2 text-white">
                Exam Preparation Hub
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xs mb-6">
                Structured notes, 10-mark long answers, solved MCQs, and formula calculators designed for top grades.
              </p>

              {/* Floating feature pills */}
              <div className="grid grid-cols-2 gap-2 w-full text-xs font-semibold">
                <div className="bg-white/15 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
                  📊 Detailed Diagrams
                </div>
                <div className="bg-white/15 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
                  📝 10 Mark Answers
                </div>
                <div className="bg-white/15 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
                  ☑️ MCQ Practice
                </div>
                <div className="bg-white/15 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
                  🖨️ Clean PDF Export
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}