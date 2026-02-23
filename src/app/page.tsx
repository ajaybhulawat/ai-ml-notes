import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import LatestTopics from "../components/LatestTopics"
import PrepareSection from "../components/PrepareSection"
import FeaturedArticles from "../components/FeaturedArticles"
import CTA from "../components/CTA"

export default function Home() {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <Hero />
      <LatestTopics />
      <PrepareSection />
      <FeaturedArticles />
      <CTA />
    </main>
  )
}

