import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllSlugs, getNoteBySlug } from "@/lib/notes"

type Props = {
  params: Promise<{ slug: string }>
}

// ✅ SSG
export async function generateStaticParams() {
  return getAllSlugs()
}

// ✅ SEO
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug } = await params
  const note = await getNoteBySlug(slug)

  if (!note) {
    return { title: "Note Not Found" }
  }

  return {
    title: note.title,
    description: note.description,
    openGraph: {
      title: note.title,
      description: note.description,
      type: "article"
    }
  }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params

  let note
  try {
    note = await getNoteBySlug(slug)
  } catch {
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">{note.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  )
}