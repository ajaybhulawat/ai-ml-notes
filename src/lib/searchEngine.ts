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

/**
 * Pure client-safe deterministic relevance scoring search engine
 */
export function searchNotesIndex(
  index: SearchDocument[],
  queryRaw: string,
  filters: SearchFilters = {}
): SearchResponse {
  const query = (queryRaw || "").trim().toLowerCase()

  // Collect available filter options from the index
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

  // 1. Filter by selected dropdown options
  let filteredDocs = index.filter((doc) => {
    if (filters.course && filters.course !== "all" && doc.course.toLowerCase() !== filters.course.toLowerCase()) {
      return false
    }
    if (filters.branch && filters.branch !== "all" && doc.branch.toLowerCase() !== filters.branch.toLowerCase()) {
      return false
    }
    if (
      filters.subject &&
      filters.subject !== "all" &&
      doc.subjectSlug.toLowerCase() !== filters.subject.toLowerCase() &&
      doc.subject.toLowerCase() !== filters.subject.toLowerCase()
    ) {
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
    // Title contains query
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
      if (titleLower.includes(term)) {
        score += 80
      }
      if (subjectLower.includes(term)) {
        score += 40
      }
      if (tagsLower.some((tag) => tag.includes(term))) {
        score += 30
      }
      if (descLower.includes(term)) {
        score += 15
      }
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
    suggestions = candidates
      .filter((candidate) => {
        const candidateLower = candidate.toLowerCase()
        return queryTerms.some((term) => candidateLower.includes(term) || term.includes(candidateLower))
      })
      .slice(0, 4)

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
