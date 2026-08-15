import { MetadataRoute } from "next"
import { getAllCourses, getBranches, getAllNotesMeta } from "@/lib/notes"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mcqs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // Add all Course pages (/notes/mtech, /notes/btech, etc.)
  const courses = getAllCourses()
  courses.forEach((course) => {
    routes.push({
      url: `${baseUrl}/notes/${course}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })

    // Add all Branch pages (/notes/mtech/cse, etc.)
    const branches = getBranches(course)
    branches.forEach((branch) => {
      routes.push({
        url: `${baseUrl}/notes/${course}/${branch}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    })
  })

  // Add all Note detail pages
  const allNotes = getAllNotesMeta()
  allNotes.forEach((note) => {
    routes.push({
      url: `${baseUrl}/notes/${note.course}/${note.branch}/${note.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  })

  return routes
}
