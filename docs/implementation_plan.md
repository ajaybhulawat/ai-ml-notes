# Implementation Plan — Phase 2: Notes Directory Upgrade

## Goal
Upgrade `/notes` ([src/app/notes/page.tsx](file:///home/justdial/ai-ml-notes/src/app/notes/page.tsx)) into a clear academic directory designed for 3-second student navigation. It will feature course-first primary cards (BTech and MTech), a quick search entry bar, a "Popular Subjects" section, and a "Recently Updated Notes" section while maintaining full dark-mode compatibility and mobile responsiveness.

---

## User Review Required

> [!NOTE]
> - Maintains existing URL routes and visual theme.
> - Adds Navbar header for seamless site navigation.
> - Primary focus on BTech and MTech courses with note counts and subject highlights.

---

## Proposed Changes

### Notes Directory Page ([src/app/notes/page.tsx](file:///home/justdial/ai-ml-notes/src/app/notes/page.tsx))

#### [MODIFY] [page.tsx](file:///home/justdial/ai-ml-notes/src/app/notes/page.tsx)
- Include `Navbar` component for consistent header navigation.
- Add hero section with page title: **Academic Study Notes** and descriptive subheader.
- Add interactive Search Trigger bar leading to `/search` or opening search.
- Display primary **Course Cards** for BTech and MTech with note counts and available subjects.
- Add **Popular Subjects** grid (Machine Learning, Deep Learning, Probabilistic Models, AI Foundations) linking to branch notes.
- Add **Recently Updated Notes** feed populated dynamically via [getAllNotesMeta()](file:///home/justdial/ai-ml-notes/src/lib/notes.ts#125-140).
- Add dark mode support (`dark:bg-gray-950`, `dark:text-gray-100`).

---

## Verification Plan

### Automated Tests
Run production build:
```bash
npm run build
```

### Manual Verification
1. Load `/notes` in browser/dev server.
2. Verify BTech and MTech course cards.
3. Verify Popular Subjects section links.
4. Verify Recently Updated Notes section renders correctly.
5. Check dark mode toggling on `/notes`.
