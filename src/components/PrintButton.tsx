"use client"

export default function PrintButton() {
  function handlePrint() {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="no-print inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-xl text-sm transition border border-indigo-200 shadow-2xs"
      title="Print or save as PDF"
    >
      <span>🖨️</span>
      <span>Print / Save PDF</span>
    </button>
  )
}
