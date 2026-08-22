import React, { Suspense } from "react"
import type { Metadata } from "next"
import { getAllNotesMeta } from "@/lib/notes"
import { getSearchIndex } from "@/lib/searchIndex"
import Navbar from "@/components/Navbar"
import NoteSearch from "@/components/NoteSearch"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes-wine.vercel.app"

type Props = {
  searchParams?: Promise<{ q?: string; course?: string; branch?: string; subject?: string; semester?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = searchParams ? await searchParams : {}
  const title = params.q
    ? `Search results for "${params.q}" | AI & ML Exam Notes`
    : "Search Academic Notes | AI & ML Exam Notes"

  return {
    title,
    description: "Search across all subjects, units, formulas, and machine learning topics.",
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/notes`,
    },
  }
}

export default async function SearchPage() {
  const allNotes = getAllNotesMeta()
  const searchIndex = getSearchIndex()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar allNotes={allNotes} />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Search Academic Notes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search across all subjects, units, formulas, and machine learning topics.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading Search...</div>}>
          <NoteSearch initialIndex={searchIndex} />
        </Suspense>
      </main>
    </div>
  )
}
