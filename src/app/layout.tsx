import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-ml-notes.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI & ML Exam Notes — Study Guides for BTech & MTech",
    template: "%s | AI & ML Exam Notes",
  },
  description: "Easy and detailed AI & ML study guides, exam notes, MCQs and revision material for BTech and MTech students.",
  keywords: [
    "AI notes",
    "ML notes",
    "Machine Learning study guide",
    "Artificial Intelligence exam preparation",
    "BTech CSE notes",
    "MTech CSE notes",
    "Neural Networks notes",
    "Bayesian Networks notes",
    "AI MCQs",
  ],
  authors: [{ name: "AI & ML Exam Notes Team" }],
  creator: "AI & ML Exam Notes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "AI & ML Exam Notes — Study Guides for BTech & MTech",
    description: "Easy and detailed AI & ML study guides, exam notes, MCQs and revision material for BTech and MTech students.",
    siteName: "AI & ML Exam Notes",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & ML Exam Notes — Study Guides for BTech & MTech",
    description: "Easy and detailed AI & ML study guides, exam notes, MCQs and revision material for BTech and MTech students.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        {children}
      </body>
    </html>
  )
}
