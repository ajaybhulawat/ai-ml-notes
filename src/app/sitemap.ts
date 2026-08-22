import { MetadataRoute } from "next"
import { getAllCourses, getBranches, getAllNotesMeta, getSubjectsForBranch, slugifySubject } from "@/lib/notes"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes-wine.vercel.app"

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

    // Add all Branch pages (/notes/btech/cse, etc.)
    const branches = getBranches(course)
    branches.forEach((branch) => {
      routes.push({
        url: `${baseUrl}/notes/${course}/${branch}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      })

      // Add all Subject pages (/notes/btech/cse/machine-learning, etc.)
      const subjects = getSubjectsForBranch(course, branch)
      subjects.forEach((subjectObj) => {
        routes.push({
          url: `${baseUrl}/notes/${course}/${branch}/${subjectObj.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      })
    })
  })

  // Add all Note detail pages (Canonical 5-level Subject URLs only)
  const allNotes = getAllNotesMeta()
  allNotes.forEach((note) => {
    const subjectSlug = slugifySubject(note.subject || "General Machine Learning")

    routes.push({
      url: `${baseUrl}/notes/${note.course}/${note.branch}/${subjectSlug}/${note.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  return routes
}
