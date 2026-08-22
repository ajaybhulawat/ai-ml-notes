"use client"

import React, { useState, useTransition, useEffect, useMemo } from "react"
import Link from "next/link"
import { searchNotesIndex, SearchDocument, SearchFilters } from "@/lib/searchEngine"

interface NoteSearchProps {
  /** Search documents index loaded from server component */
  initialIndex?: SearchDocument[]
  /** Default children rendered when no search/filters active */
  children?: React.ReactNode
}

export default function NoteSearch({ initialIndex = [], children }: NoteSearchProps) {
  const [query, setQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [branchFilter, setBranchFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [displayLimit, setDisplayLimit] = useState(20)

  const [, startTransition] = useTransition()

  // Read initial query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.has("q")) setQuery(params.get("q") || "")
      if (params.has("course")) setCourseFilter(params.get("course") || "all")
      if (params.has("branch")) setBranchFilter(params.get("branch") || "all")
      if (params.has("subject")) setSubjectFilter(params.get("subject") || "all")
      if (params.has("semester")) setSemesterFilter(params.get("semester") || "all")
    }
  }, [])

  // Sync state with URL parameters
  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (courseFilter !== "all") params.set("course", courseFilter)
    if (branchFilter !== "all") params.set("branch", branchFilter)
    if (subjectFilter !== "all") params.set("subject", subjectFilter)
    if (semesterFilter !== "all") params.set("semester", semesterFilter)

    const queryString = params.toString()
    const newUrl = queryString ? `/notes?${queryString}` : "/notes"

    startTransition(() => {
      window.history.replaceState(null, "", newUrl)
    })
  }, [query, courseFilter, branchFilter, subjectFilter, semesterFilter])

  // Active filters object
  const activeFilters: SearchFilters = useMemo(
    () => ({
      course: courseFilter,
      branch: branchFilter,
      subject: subjectFilter,
      semester: semesterFilter,
    }),
    [courseFilter, branchFilter, subjectFilter, semesterFilter]
  )

  // Execute client-safe search engine
  const searchResponse = useMemo(() => {
    return searchNotesIndex(initialIndex, query, activeFilters)
  }, [initialIndex, query, activeFilters])

  const { results, total, suggestions, availableFilters } = searchResponse

  const isSearchActive = Boolean(
    query.trim() ||
      courseFilter !== "all" ||
      branchFilter !== "all" ||
      subjectFilter !== "all" ||
      semesterFilter !== "all"
  )

  const handleClear = () => {
    setQuery("")
    setCourseFilter("all")
    setBranchFilter("all")
    setSubjectFilter("all")
    setSemesterFilter("all")
    setDisplayLimit(20)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear()
    }
  }

  const visibleResults = results.slice(0, displayLimit)

  return (
    <div className="space-y-8">
      {/* Search Input Bar & Filter Bar Header */}
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main Search Input Box */}
        <div className="relative flex items-center">
          <label htmlFor="note-search-input" className="sr-only">
            Search notes, subjects, or topics
          </label>
          <div className="absolute left-4 text-gray-400 pointer-events-none text-xl">🔍</div>
          <input
            id="note-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setDisplayLimit(20)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search notes, subjects, or topics..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-base transition-all placeholder:text-gray-400"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              aria-label="Clear search text"
            >
              ✕
            </button>
          )}
        </div>

        {/* Faceted Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Filters:</span>

            {/* Course Filter */}
            {availableFilters.courses.length > 0 && (
              <select
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value)
                  setDisplayLimit(20)
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                aria-label="Filter by course"
              >
                <option value="all">Course: All</option>
                {availableFilters.courses.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>
            )}

            {/* Branch Filter */}
            {availableFilters.branches.length > 0 && (
              <select
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value)
                  setDisplayLimit(20)
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                aria-label="Filter by branch"
              >
                <option value="all">Branch: All</option>
                {availableFilters.branches.map((b) => (
                  <option key={b} value={b}>
                    {b.toUpperCase()}
                  </option>
                ))}
              </select>
            )}

            {/* Subject Filter */}
            {availableFilters.subjects.length > 0 && (
              <select
                value={subjectFilter}
                onChange={(e) => {
                  setSubjectFilter(e.target.value)
                  setDisplayLimit(20)
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 max-w-[180px] truncate"
                aria-label="Filter by subject"
              >
                <option value="all">Subject: All</option>
                {availableFilters.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {/* Semester Filter */}
            {availableFilters.semesters.length > 0 && (
              <select
                value={semesterFilter}
                onChange={(e) => {
                  setSemesterFilter(e.target.value)
                  setDisplayLimit(20)
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                aria-label="Filter by semester"
              >
                <option value="all">Semester: All</option>
                {availableFilters.semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Reset Filters / Result Status */}
          <div className="flex items-center gap-3">
            {isSearchActive && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Reset Filters ✕
              </button>
            )}
            <span role="status" aria-live="polite" className="text-gray-500 dark:text-gray-400">
              {isSearchActive ? `${total} ${total === 1 ? "note found" : "notes found"}` : "Ready to search"}
            </span>
          </div>
        </div>
      </div>

      {/* Render Results Panel when Search is Active */}
      {isSearchActive ? (
        <section className="space-y-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {query.trim() ? `Search Results for "${query}"` : "Filtered Study Notes"}
            </h2>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Showing {visibleResults.length} of {total}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleResults.map((doc) => (
                <div
                  key={doc.id}
                  className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg dark:hover:border-indigo-600 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                        {doc.course.toUpperCase()} · {doc.branch.toUpperCase()}
                      </span>
                      {doc.unit && (
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                          {doc.unit}
                        </span>
                      )}
                    </div>

                    <Link href={doc.canonicalUrl}>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                        {doc.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                      {doc.description}
                    </p>

                    {/* Tag Badges */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span>{doc.subject}</span>
                    <Link
                      href={doc.canonicalUrl}
                      className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition flex items-center gap-1"
                    >
                      <span>Read {doc.title} Notes</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Results Found View */
            <div className="text-center py-16 px-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
              <div className="text-5xl">🔎</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  No notes found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn&apos;t find any study guides matching &quot;<span className="font-semibold text-gray-800 dark:text-gray-200">{query}</span>&quot;.
                </p>
              </div>

              {suggestions && suggestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Try searching for:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setQuery(sug)}
                        className="px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-medium hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Load More Pagination Button */}
          {results.length > visibleResults.length && (
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 20)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition"
              >
                Load More Results ({results.length - visibleResults.length} remaining)
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Fall back to normal children view when search is empty */
        children
      )}
    </div>
  )
}
