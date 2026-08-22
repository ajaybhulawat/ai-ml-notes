import fs from "fs"
import path from "path"
import { getAllNotesMeta, slugifySubject } from "./notes"

const notesDirectory = path.join(process.cwd(), "src/content/notes")

export interface SearchDocument {
  id: string
  slug: string
  title: string
  description: string
  course: string
  branch: string
  semester: string
  subject: string
  subjectSlug: string
  unit: string
  tags: string[]
  content: string
  canonicalUrl: string
}

export interface SearchFilters {
  course?: string
  branch?: string
  subject?: string
  semester?: string
}

export interface SearchResult {
  doc: SearchDocument
  score: number
}

export interface SearchResponse {
  results: SearchDocument[]
  total: number
  query: string
  suggestions: string[]
  availableFilters: {
    courses: string[]
    branches: string[]
    subjects: string[]
    semesters: string[]
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes-wine.vercel.app"

/**
 * Strip Markdown tags to produce clean plain text for indexing
 */
function stripMarkdown(md: string): string {
  if (!md) return ""
  return md
    .replace(/#+\s+/g, "") // Remove headers
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italics
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
    .replace(/\\\(.*?\\\)/g, "") // Remove inline math
    .replace(/\\\[.*?\\\]/g, "") // Remove block math
    .replace(/>\s+/g, "") // Remove blockquotes
    .replace(/\n+/g, " ") // Flatten whitespace
    .toLowerCase()
}

let cachedIndex: SearchDocument[] | null = null

/**
 * Generate normalized search index from notes metadata & Markdown content
 */
export function getSearchIndex(): SearchDocument[] {
  if (cachedIndex) return cachedIndex

  const notes = getAllNotesMeta()

  cachedIndex = notes.map((note) => {
    const subjectName = note.subject || "Machine Learning"
    const subjectSlug = slugifySubject(subjectName)
    const tags = note.keywords || []
    const canonicalUrl = `${siteUrl}/notes/${note.course}/${note.branch}/${subjectSlug}/${note.slug}`

    let plainContent = ""
    try {
      const fullPath = path.join(notesDirectory, note.course, note.branch, `${note.slug}.md`)
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8")
        plainContent = stripMarkdown(fileContents)
      }
    } catch {
      plainContent = ""
    }

    return {
      id: `${note.course}-${note.branch}-${note.slug}`,
      slug: note.slug,
      title: note.title,
      description: note.description || "",
      course: note.course,
      branch: note.branch,
      semester: note.semester || "",
      subject: subjectName,
      subjectSlug,
      unit: note.unit || "",
      tags,
      content: plainContent,
      canonicalUrl,
    }
  })

  return cachedIndex
}

/**
 * Deterministic Relevance Scoring & Search Engine
 */
export function searchNotes(queryRaw: string, filters: SearchFilters = {}): SearchResponse {
  const index = getSearchIndex()
  const query = (queryRaw || "").trim().toLowerCase()

  // Collect available filter values from current index
  const coursesSet = new Set<string>()
  const branchesSet = new Set<string>()
  const subjectsSet = new Set<string>()
  const semestersSet = new Set<string>()

  index.forEach((doc) => {
    if (doc.course) coursesSet.add(doc.course)
    if (doc.branch) branchesSet.add(doc.branch)
    if (doc.subject) subjectsSet.add(doc.subject)
    if (doc.semester) semestersSet.add(doc.semester)
  })

  const availableFilters = {
    courses: Array.from(coursesSet),
    branches: Array.from(branchesSet),
    subjects: Array.from(subjectsSet),
    semesters: Array.from(semestersSet),
  }

  // 1. Filter documents by selected dropdown options
  let filteredDocs = index.filter((doc) => {
    if (filters.course && filters.course !== "all" && doc.course.toLowerCase() !== filters.course.toLowerCase()) {
      return false
    }
    if (filters.branch && filters.branch !== "all" && doc.branch.toLowerCase() !== filters.branch.toLowerCase()) {
      return false
    }
    if (filters.subject && filters.subject !== "all" && doc.subjectSlug.toLowerCase() !== filters.subject.toLowerCase() && doc.subject.toLowerCase() !== filters.subject.toLowerCase()) {
      return false
    }
    if (filters.semester && filters.semester !== "all" && doc.semester.toLowerCase() !== filters.semester.toLowerCase()) {
      return false
    }
    return true
  })

  // 2. If no query, return filtered documents in default order
  if (!query) {
    return {
      results: filteredDocs,
      total: filteredDocs.length,
      query: "",
      suggestions: [],
      availableFilters,
    }
  }

  // 3. Relevance Scoring
  const queryTerms = query.split(/\s+/).filter(Boolean)

  const scoredResults: SearchResult[] = []

  filteredDocs.forEach((doc) => {
    let score = 0
    const titleLower = doc.title.toLowerCase()
    const subjectLower = doc.subject.toLowerCase()
    const descLower = doc.description.toLowerCase()
    const tagsLower = doc.tags.map((t) => t.toLowerCase())
    const contentLower = doc.content

    // Exact title match
    if (titleLower === query) {
      score += 1000
    }
    // Title starts with query
    else if (titleLower.startsWith(query)) {
      score += 500
    }
    // Title contains full query
    else if (titleLower.includes(query)) {
      score += 200
    }

    // Subject exact or partial match
    if (subjectLower === query) {
      score += 300
    } else if (subjectLower.includes(query)) {
      score += 100
    }

    // Term-by-term scoring
    queryTerms.forEach((term) => {
      // Title term match
      if (titleLower.includes(term)) {
        score += 80
      }
      // Subject term match
      if (subjectLower.includes(term)) {
        score += 40
      }
      // Tag match
      if (tagsLower.some((tag) => tag.includes(term))) {
        score += 30
      }
      // Description match
      if (descLower.includes(term)) {
        score += 15
      }
      // Body content match
      if (contentLower.includes(term)) {
        score += 5
      }
    })

    if (score > 0) {
      scoredResults.push({ doc, score })
    }
  })

  // Sort descending by relevance score
  scoredResults.sort((a, b) => b.score - a.score)

  const results = scoredResults.map((item) => item.doc)

  // 4. Generate intelligent suggestions if 0 results found
  let suggestions: string[] = []
  if (results.length === 0) {
    const candidateTerms = new Set<string>()

    index.forEach((doc) => {
      candidateTerms.add(doc.title)
      candidateTerms.add(doc.subject)
      doc.tags.forEach((t) => candidateTerms.add(t))
    })

    const candidates = Array.from(candidateTerms)
    // Find candidates that partially match any term in query
    suggestions = candidates
      .filter((candidate) => {
        const candidateLower = candidate.toLowerCase()
        return queryTerms.some((term) => candidateLower.includes(term) || term.includes(candidateLower))
      })
      .slice(0, 4)

    // Fallback default suggestions if no partial match
    if (suggestions.length === 0) {
      suggestions = ["Decision Trees", "Linear Regression", "Support Vector Machines", "Convolutional Neural Networks"]
    }
  }

  return {
    results,
    total: results.length,
    query: queryRaw,
    suggestions,
    availableFilters,
  }
}
