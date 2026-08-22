import fs from "fs"
import path from "path"
import { getAllNotesMeta, slugifySubject } from "./notes"
import { SearchDocument } from "./searchEngine"

const notesDirectory = path.join(process.cwd(), "src/content/notes")
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes-wine.vercel.app"

function stripMarkdown(md: string): string {
  if (!md) return ""
  return md
    .replace(/#+\s+/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\\\(.*?\\\)/g, "")
    .replace(/\\\[.*?\\\]/g, "")
    .replace(/>\s+/g, "")
    .replace(/\n+/g, " ")
    .toLowerCase()
}

let cachedIndex: SearchDocument[] | null = null

/**
 * Generate normalized search index from notes metadata & Markdown content (Server Side only)
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
