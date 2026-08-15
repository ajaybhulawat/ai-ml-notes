"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { mcqs, mcqCategories } from "@/data/mcqs"

export default function MCQsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})

  // Filter questions by selected category
  const filteredMCQs = selectedCategory === "All"
    ? mcqs
    : mcqs.filter((q) => q.category === selectedCategory)

  // Handle option selection
  function handleSelectOption(questionId: string, optionIndex: number) {
    if (userAnswers[questionId] !== undefined) return // prevent changing answer after selecting
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  // Calculate score
  const answeredCount = Object.keys(userAnswers).length
  const correctCount = Object.entries(userAnswers).reduce((acc, [qId, optionIdx]) => {
    const question = mcqs.find((m) => m.id === qId)
    return question && question.correctIndex === optionIdx ? acc + 1 : acc
  }, 0)

  // Reset quiz
  function handleReset() {
    setUserAnswers({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            AI &amp; ML Exam MCQs Practice
          </h1>
          <p className="text-gray-500 text-lg">
            Multiple-choice practice questions with instant answer verification and explanations.
          </p>
        </div>

        {/* Category Filters + Score Tracker Bar */}
        <div className="bg-white border rounded-2xl p-6 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {mcqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Score & Progress */}
          <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-xs">
            <div>
              <span className="text-gray-500 font-medium">Score: </span>
              <span className="font-bold text-indigo-700">{correctCount}</span> / {filteredMCQs.length}
            </div>
            <div className="h-4 w-px bg-indigo-200" />
            <div>
              <span className="text-gray-500 font-medium">Answered: </span>
              <span className="font-bold text-indigo-700">{answeredCount}</span> / {filteredMCQs.length}
            </div>
            {answeredCount > 0 && (
              <button
                onClick={handleReset}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredMCQs.map((item, index) => {
            const selectedOption = userAnswers[item.id]
            const isAnswered = selectedOption !== undefined
            const isCorrect = selectedOption === item.correctIndex

            return (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-6 shadow-xs transition hover:shadow-sm"
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 uppercase">
                    Q{index + 1} — {item.category}
                  </span>
                  {isAnswered && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <h3 className="text-lg font-bold text-gray-800 mb-4 leading-snug">
                  {item.question}
                </h3>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  {item.options.map((option, optIdx) => {
                    let optionStyle = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200"

                    if (isAnswered) {
                      if (optIdx === item.correctIndex) {
                        optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-xs"
                      } else if (optIdx === selectedOption) {
                        optionStyle = "bg-rose-50 border-rose-400 text-rose-900 font-semibold"
                      } else {
                        optionStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-60"
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(item.id, optIdx)}
                        className={`text-left p-4 rounded-xl border text-sm transition flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-white/70 border shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswered && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                    <p className="font-bold text-xs uppercase text-slate-500 mb-1 flex items-center gap-1">
                      <span>💡</span> Explanation
                    </p>
                    <p>{item.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/notes"
            className="inline-block bg-white border px-6 py-3 rounded-xl font-semibold text-indigo-600 hover:bg-gray-50 transition shadow-xs"
          >
            ← Back to Notes Platform
          </Link>
        </div>
      </main>
    </div>
  )
}
