export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h1 className="text-xl font-bold text-blue-900">
            AI & ML Exam Notes
          </h1>
        </div>

        <div className="hidden md:flex gap-6 font-medium text-gray-700">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Exam Notes</a>
          <a href="#" className="hover:text-blue-600">MCQs</a>
          <a href="#" className="hover:text-blue-600">Videos</a>
          <a href="#" className="hover:text-blue-600">About Us</a>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg">
            Exam PDFs
          </button>
        </div>
      </div>
    </nav>
  )
}