# AI & ML Notes — Current Architecture Audit

## Executive Summary
This document provides a comprehensive audit of the `ai-ml-notes` codebase as of **Phase 0** of the Antigravity Implementation Plan. The application is a Next.js 16 (App Router) static site / web platform providing structured academic study guides for engineering students.

---

## 1. Stack & Framework Version
- **Framework:** Next.js `16.1.6` (App Router, Turbopack dev, Static Site Generation for notes via `generateStaticParams`)
- **React:** React `19.2.3` (React Compiler enabled in `next.config.ts`)
- **Language:** TypeScript `5.x` (`tsconfig.json` with strict mode, `@/*` alias)
- **Styling:** Tailwind CSS `v4` (`@tailwindcss/postcss`, `@tailwindcss/typography`)
- **Markdown Parsing:** `gray-matter` (frontmatter extraction) + `remark` + `remark-html`
- **Interactive UI:** Particles (`react-tsparticles`), Theme toggle (dark mode via CSS variables/classes), Search modal (client-side in-memory filter), Formula calculators, Bookmarks (localStorage), MCQs practice (client-side state).

---

## 2. Directory & Routing Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with Geist fonts, global SEO metadata
│   ├── globals.css               # Global styles, Tailwind v4 imports, dark mode
│   ├── page.tsx                  # Landing page (Hero, Features, Featured Articles, CTA)
│   ├── notes/
│   │   ├── page.tsx              # /notes — Course Selection (BTech, MTech, BA, MA cards)
│   │   ├── layout.tsx            # Simple wrapper
│   │   └── [course]/
│   │       ├── page.tsx          # /notes/[course] — Branch Selection (CSE, ECE, Civil, etc.)
│   │       └── [branch]/
│   │           ├── layout.tsx    # Layout with sticky Sidebar (grouped by unit)
│   │           ├── page.tsx      # /notes/[course]/[branch] — Notes list grouped by unit
│   │           └── [slug]/
│   │               └── page.tsx  # /notes/[course]/[branch]/[slug] — Detail page with TOC, JSON-LD, Print & Bookmark buttons
│   ├── mcqs/
│   │   └── page.tsx              # /mcqs — Practice MCQs page
│   ├── bookmarks/
│   │   └── page.tsx              # /bookmarks — Saved bookmarks page
│   ├── formulas/
│   │   └── page.tsx              # /formulas — Interactive formula calculators
│   ├── search/
│   │   └── page.tsx              # /search — Dedicated search page
│   ├── sitemap.ts                # Dynamic Next.js Sitemap generator
│   └── robots.ts                 # Dynamic Next.js Robots.txt generator
├── components/
│   ├── Navbar.tsx                # Sticky navbar with logo, nav links, Search trigger, ThemeToggle
│   ├── Sidebar.tsx               # Sticky sidebar for branch note navigation (unit grouped)
│   ├── SearchModal.tsx           # Keyboard-navigable client modal search (in-memory filtering)
│   ├── BookmarkButton.tsx        # Add/remove note bookmark using localStorage
│   ├── PrintButton.tsx           # Window print trigger
│   ├── ThemeToggle.tsx           # Dark mode toggle button
│   ├── Hero.tsx                  # Landing page hero component
│   ├── FeaturedArticles.tsx     # Featured notes list on homepage
│   ├── LatestTopics.tsx          # Latest topics on homepage
│   └── PrepareSection.tsx        # Exam prep overview section
├── lib/
│   └── notes.ts                  # Node.js fs-based markdown data fetcher & parser
├── content/
│   └── notes/                    # Raw Markdown note files
│       ├── btech/cse/*.md        # 4 notes (decision-trees, linear-regression, pca, svm)
│       └── mtech/cse/*.md        # 6 notes (bayesian-networks, cnn, diff-ai-ml, intro-nn, k-means, rnn-lstm)
└── data/
    ├── mcqs.ts                   # Static MCQ data (25 questions with explanations & categories)
    └── notes.ts                  # Legacy unused array (can be cleaned up or refactored)
```

---

## 3. Current Data Model

### Frontmatter Metadata Schema (Current)
```yaml
---
title: "Decision Trees in Machine Learning"
description: "Understand how decision trees work, their splitting criteria, and real-world applications."
unit: "Unit 2 – Supervised Learning"
---
```

### Note Type Definitions (`src/lib/notes.ts`)
```ts
export type NoteMeta = {
  course: string      # Extracted from folder path (e.g., "btech")
  branch: string      # Extracted from folder path (e.g., "cse")
  slug: string        # Extracted from filename (e.g., "decision-trees")
  title: string       # From frontmatter title (or fallback to slug)
  description: string # From frontmatter description
  unit: string        # From frontmatter unit (or fallback to "General")
}

export type NoteDetail = NoteMeta & {
  content: string     # Processed HTML string with heading IDs
  headings: Heading[] # Headings array extracted for TOC [{ id, text, level }]
}
```

---

## 4. Current SEO & Metadata Implementation
- **Root Layout Metadata:** Sets `metadataBase`, default title, title template (`%s | AI & ML Exam Notes`), canonical description, OpenGraph, Twitter cards, and `robots: { index: true, follow: true }`.
- **Note Detail Metadata:** Generates dynamic `title`, `description`, `openGraph` (type `article`), and `twitter` card.
- **Structured Data (JSON-LD):** Injected into `NotePage` (`@type: TechArticle`, `headline`, `description`, `articleSection`, `educationalLevel`).
- **Dynamic Sitemap (`src/app/sitemap.ts`):** Automatically maps `/`, `/notes`, `/mcqs`, `/search`, all courses (`/notes/[course]`), all branches (`/notes/[course]/[branch]`), and all individual note pages (`/notes/[course]/[branch]/[slug]`).
- **Robots.txt (`src/app/robots.ts`):** Allows all paths, disallows `/api/`, links to `sitemap.xml`.

---

## 5. Existing Features & UX Review
1. **Routing Path:** `Home -> /notes -> /notes/btech -> /notes/btech/cse -> /notes/btech/cse/decision-trees`.
2. **Search Implementation:** Client-side modal (`SearchModal.tsx`) using `allNotes` metadata passed down. Performs case-insensitive matching on `title`, `description`, `unit`, `course`, `branch`, `slug`. Includes keyboard shortcut (`Cmd+K` / `/`) and arrow key navigation.
3. **Dark Mode:** Supported across all components using Tailwind's `dark:` variant and class-based toggle.
4. **PDF / Print:** `PrintButton.tsx` triggers `window.print()`. CSS contains `no-print` classes on Navbar, Sidebar, Breadcrumbs, and TOC to print clean note content.
5. **MCQs:** Interactive practice page (`/mcqs`) with category filtering, score tracking, answer feedback, and explanations.

---

## 6. Known Gaps & Technical Debt (Relative to Product Plan)
1. **Missing Subject Layer in Data & Routing:**
   - Currently, notes live directly at `src/content/notes/{course}/{branch}/{slug}.md`.
   - The Product Plan target structure is `/notes/{course}/{branch}/{subject}/{topic}`.
   - Frontmatter currently lacks explicit `subject`, `semester`, `keywords`, `relatedSlugs`, `previousSlug`, `nextSlug`, `marks` (2-mark, 5-mark, 10-mark breakdown metadata).
2. **Missing Course & Branch Landing Page Sections:**
   - `/notes/btech` lacks subject grouping, popular topics, and semester breakdown.
   - `/notes/btech/cse` groups directly by `unit`, skipping subject context.
3. **No Dedicated Subject Page:**
   - There is no `/notes/[course]/[branch]/[subject]` page yet.
4. **Topic Page Structure:**
   - Current topic pages display standard markdown content. They do not yet feature explicit exam tabs (`[2 Marks]`, `[5 Marks]`, `[10 Marks]`, `[Quick Revision]`), exam answer copy buttons, or explicit Previous/Next & Related Topics links.
5. **Legacy Code:** `src/data/notes.ts` is an unused hardcoded array.

---

## 7. Recommended Minimal Implementation Path for Product Plan

To fulfill the Product Plan without breaking existing URLs or data:

### Phase 1 (Data Model):
- Enhance `NoteMeta` type in `src/lib/notes.ts` to support optional metadata fields (`subject`, `semester`, `keywords`, `relatedSlugs`, `order`, etc.).
- Maintain backwards compatibility: if `subject` is omitted, derive it or default cleanly.

### Phase 2 (`/notes` Directory):
- Enhance `/notes` page with Course Cards (BTech, MTech), Popular Subjects, Recently Updated notes, and quick search.

### Phase 3 & 4 (Course & Branch Pages):
- Upgrade `/notes/[course]` and `/notes/[course]/[branch]` to display structured subject & semester navigation.

### Phase 5 (Subject Pages):
- Introduce subject-level routing/sections.

### Phase 6 (Reference Topic Page):
- Upgrade `Decision Tree` note (`src/content/notes/btech/cse/decision-trees.md`) and topic template to showcase the complete exam-first experience (2/5/10-mark answer sections, quick revision, related topics, prev/next).

---

## 8. Build Verification Result
- Production build status verified via `npm run build`.
