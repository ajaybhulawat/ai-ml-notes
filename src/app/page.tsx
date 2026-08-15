import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import LatestTopics from "../components/LatestTopics"
import PrepareSection from "../components/PrepareSection"
import FeaturedArticles from "../components/FeaturedArticles"
import CTA from "../components/CTA"
import { getAllNotesMeta } from "@/lib/notes"

export default function Home() {
  const notes = getAllNotesMeta()

  return (
    <main className="bg-gray-50">
      <Navbar allNotes={notes} />
      <Hero />
      <LatestTopics />
      <PrepareSection />
      <FeaturedArticles />
      <CTA />
    </main>
  )
}
