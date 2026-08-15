import Link from "next/link"

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-6 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full -z-0" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Download Our <span className="text-orange-400">Exam PDF Notes!</span>
        </h2>

        <p className="text-indigo-200 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Get Complete Study Notes for Your Exams in PDF Format! Clean layouts, high-resolution diagrams, and print-ready formatting.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/notes"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/30 transition hover:scale-105 active:scale-95 text-base"
          >
            Download Now
          </Link>
        </div>
      </div>
    </section>
  )
}