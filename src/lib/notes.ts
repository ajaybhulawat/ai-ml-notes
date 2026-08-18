import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const notesDirectory = path.join(process.cwd(), "src/content/notes")

export type Heading = {
  id: string
  text: string
  level: number
}

export type NoteMeta = {
  course: string
  branch: string
  slug: string
  title: string
  description: string
  unit: string
  subject?: string
  semester?: string
  keywords?: string[]
  relatedSlugs?: string[]
  previousSlug?: string
  nextSlug?: string
  order?: number
}

export type NoteDetail = NoteMeta & {
  content: string
  headings: Heading[]
}

// Get all courses (top-level directories)
export function getAllCourses(): string[] {
  if (!fs.existsSync(notesDirectory)) return []
  return fs.readdirSync(notesDirectory).filter((name) => {
    return fs.statSync(path.join(notesDirectory, name)).isDirectory()
  })
}

// Get all branches for a course
export function getBranches(course: string): string[] {
  const coursePath = path.join(notesDirectory, course)
  if (!fs.existsSync(coursePath)) return []

  return fs.readdirSync(coursePath).filter((name) => {
    return fs.statSync(path.join(coursePath, name)).isDirectory()
  })
}

// Helper to parse keywords from array or string
function parseKeywords(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
  if (typeof raw === "string") return raw.split(",").map((k) => k.trim()).filter(Boolean)
  return undefined
}

// Helper to parse array of strings
function parseStringArray(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
  if (typeof raw === "string") return raw.split(",").map((k) => k.trim()).filter(Boolean)
  return undefined
}

// Helper for dynamic pluralization e.g. pluralize(1, "Subject") -> "1 Subject"
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`
  return `${count} ${plural || singular + "s"}`
}

// Helper to parse unit number from string e.g. "Unit 1 – Supervised Learning" -> 1
export function getUnitNumber(unitStr?: string): number {
  if (!unitStr) return 999
  const match = unitStr.match(/unit\s*(\d+)/i)
  if (match) return parseInt(match[1], 10)
  return 999
}

// Academic sorting helper:
// 1. Primary: Unit number (Unit 1, Unit 2, Unit 3, etc.)
// 2. Secondary: Order within unit (1, 2, 3)
// 3. Fallback: Slug
export function sortNotesAcademically(notes: NoteMeta[]): NoteMeta[] {
  return [...notes].sort((a, b) => {
    const unitA = getUnitNumber(a.unit)
    const unitB = getUnitNumber(b.unit)

    if (unitA !== unitB) {
      return unitA - unitB
    }

    const orderA = typeof a.order === "number" ? a.order : 999
    const orderB = typeof b.order === "number" ? b.order : 999

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.slug.localeCompare(b.slug)
  })
}

// Get all note metadata for a specific course + branch
export function getNotesForBranch(course: string, branch: string): NoteMeta[] {
  const branchPath = path.join(notesDirectory, course, branch)
  if (!fs.existsSync(branchPath)) return []

  const files = fs.readdirSync(branchPath).filter((f) => f.endsWith(".md"))

  const rawNotes = files.map((file) => {
    const slug = file.replace(".md", "")
    const fullPath = path.join(branchPath, file)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    return {
      course,
      branch,
      slug,
      title: data.title || slug,
      description: data.description || "",
      unit: data.unit || "General",
      subject: data.subject || undefined,
      semester: data.semester || undefined,
      keywords: parseKeywords(data.keywords),
      relatedSlugs: parseStringArray(data.relatedSlugs),
      previousSlug: data.previousSlug || undefined,
      nextSlug: data.nextSlug || undefined,
      order: typeof data.order === "number" ? data.order : undefined,
    }
  })

  return sortNotesAcademically(rawNotes)
}

// Get all slugs for static generation
export function getAllSlugs(): { course: string; branch: string; slug: string }[] {
  const courses = getAllCourses()
  const allSlugs: { course: string; branch: string; slug: string }[] = []

  courses.forEach((course) => {
    const branches = getBranches(course)
    branches.forEach((branch) => {
      const branchPath = path.join(notesDirectory, course, branch)
      if (!fs.existsSync(branchPath)) return
      const files = fs.readdirSync(branchPath)

      files.forEach((file) => {
        if (!file.endsWith(".md")) return
        allSlugs.push({
          course,
          branch,
          slug: file.replace(".md", ""),
        })
      })
    })
  })

  return allSlugs
}

// Get all notes metadata across every course/branch
export function getAllNotesMeta(): NoteMeta[] {
  const courses = getAllCourses()
  const allNotes: NoteMeta[] = []

  courses.forEach((course) => {
    const branches = getBranches(course)
    branches.forEach((branch) => {
      const notes = getNotesForBranch(course, branch)
      allNotes.push(...notes)
    })
  })

  return allNotes
}

// Helper to convert subject name into a URL slug
export function slugifySubject(subjectName: string): string {
  return subjectName
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Get all subjects for a branch
export function getSubjectsForBranch(course: string, branch: string) {
  const notes = getNotesForBranch(course, branch)
  const map: Record<string, { subject: string; slug: string; notes: NoteMeta[] }> = {}

  notes.forEach((note) => {
    const subjectName = note.subject || "General Machine Learning"
    const slug = slugifySubject(subjectName)

    if (!map[slug]) {
      map[slug] = {
        subject: subjectName,
        slug,
        notes: [],
      }
    }
    map[slug].notes.push(note)
  })

  return Object.values(map)
}

// Get single subject details by course, branch, subjectSlug
export function getSubjectBySlug(course: string, branch: string, subjectSlug: string) {
  const subjects = getSubjectsForBranch(course, branch)
  return subjects.find((s) => s.slug === subjectSlug.toLowerCase()) ?? null
}

// Get notes for a specific subject
export function getNotesForSubject(course: string, branch: string, subjectSlug: string): NoteMeta[] {
  const subjectObj = getSubjectBySlug(course, branch, subjectSlug)
  return subjectObj ? subjectObj.notes : []
}

// Get all subject params for static generation
export function getAllSubjectParams(): { course: string; branch: string; subject: string }[] {
  const courses = getAllCourses()
  const params: { course: string; branch: string; subject: string }[] = []

  courses.forEach((course) => {
    getBranches(course).forEach((branch) => {
      const subjects = getSubjectsForBranch(course, branch)
      subjects.forEach((s) => {
        params.push({ course, branch, subject: s.slug })
      })
    })
  })

  return params
}

// Get all 5-level topic params for static generation
export function getAllSubjectTopicParams(): { course: string; branch: string; subject: string; slug: string }[] {
  const courses = getAllCourses()
  const params: { course: string; branch: string; subject: string; slug: string }[] = []

  courses.forEach((course) => {
    getBranches(course).forEach((branch) => {
      const notes = getNotesForBranch(course, branch)
      notes.forEach((note) => {
        const subjectSlug = slugifySubject(note.subject || "General Machine Learning")
        params.push({
          course,
          branch,
          subject: subjectSlug,
          slug: note.slug,
        })
      })
    })
  })

  return params
}

// Helper to convert heading text into a URL slug id
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Extract headings from markdown content
function extractHeadings(markdownContent: string): Heading[] {
  const headingLines = markdownContent.split("\n").filter((line) => line.startsWith("## ") || line.startsWith("### "))

  return headingLines.map((line) => {
    const level = line.startsWith("### ") ? 3 : 2
    const text = line.replace(/^#{2,3}\s+/, "").trim()
    const id = slugify(text)
    return { id, text, level }
  })
}

// Inject id attributes into generated HTML heading tags
function addHeadingIdsToHtml(htmlString: string): string {
  return htmlString.replace(/<(h[23])>(.*?)<\/\1>/gi, (_, tag, content) => {
    // Strip inner HTML tags if any to get raw text for slug
    const rawText = content.replace(/<[^>]+>/g, "").trim()
    const id = slugify(rawText)
    return `<${tag} id="${id}">${content}</${tag}>`
  })
}

// Get a single note by its full path with TOC headings
export async function getNoteBySlug(
  course: string,
  branch: string,
  slug: string
): Promise<NoteDetail | null> {
  const fullPath = path.join(notesDirectory, course, branch, `${slug}.md`)

  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const headings = extractHeadings(content)

  const processedContent = await remark()
    .use(html)
    .process(content)

  const htmlWithIds = addHeadingIdsToHtml(processedContent.toString())

  return {
    course,
    branch,
    slug,
    title: data.title || slug,
    description: data.description || "",
    unit: data.unit || "General",
    subject: data.subject || undefined,
    semester: data.semester || undefined,
    keywords: parseKeywords(data.keywords),
    relatedSlugs: parseStringArray(data.relatedSlugs),
    previousSlug: data.previousSlug || undefined,
    nextSlug: data.nextSlug || undefined,
    order: typeof data.order === "number" ? data.order : undefined,
    content: htmlWithIds,
    headings,
  }
}

// Search all notes by query
export function searchNotes(query: string): NoteMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const allNotes = getAllNotesMeta()

  return allNotes.filter((note) => {
    return (
      note.title.toLowerCase().includes(q) ||
      note.description.toLowerCase().includes(q) ||
      note.unit.toLowerCase().includes(q) ||
      note.course.toLowerCase().includes(q) ||
      note.branch.toLowerCase().includes(q) ||
      note.slug.toLowerCase().includes(q) ||
      (note.subject && note.subject.toLowerCase().includes(q)) ||
      (note.keywords && note.keywords.some((k) => k.toLowerCase().includes(q)))
    )
  })
}