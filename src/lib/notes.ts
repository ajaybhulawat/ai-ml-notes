import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const notesDirectory = path.join(process.cwd(), "src/content/notes")

export function getAllSlugs() {
  return fs.readdirSync(notesDirectory).map(file => ({
    slug: file.replace(".md", "")
  }))
}

export function getAllNotesMeta() {
  const files = fs.readdirSync(notesDirectory)

  return files.map((file) => {
    const slug = file.replace(".md", "")
    const fullPath = path.join(notesDirectory, file)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title,
      unit: data.unit,
    }
  })
}

export async function getNoteBySlug(slug: string) {
  const fullPath = path.join(notesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(content)

  const contentHtml = processedContent.toString()

  return {
    slug,
    title: data.title,
    description: data.description,
    content: contentHtml
  }
}