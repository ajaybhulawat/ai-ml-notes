# AI & ML Notes — Antigravity Implementation Plan

## Purpose

This document is the implementation blueprint for upgrading the existing AI & ML Notes website into a scalable, exam-first academic notes platform.

**Existing project:** `ai-ml-notes`
**Current live site:** https://ai-ml-notes-wine.vercel.app/
**Primary development tool:** Google Antigravity
**Goal:** Implement the work in small, verifiable phases without breaking the existing site.

---

# 0. IMPORTANT RULES FOR THE AGENT

Before changing code:

1. Inspect the existing repository first.
2. Do NOT replace the existing architecture unless necessary.
3. Reuse existing components, Markdown files, utilities, and styling.
4. Do NOT delete existing notes.
5. Do NOT change URLs unnecessarily.
6. If an existing URL must change, create a redirect.
7. Work in small phases.
8. After each phase:
   - run the build
   - fix TypeScript/lint errors
   - verify important routes
   - inspect the UI
9. Do not add unnecessary dependencies.
10. Keep the website fast and SEO-friendly.
11. Do not create fake content just to fill pages.
12. Do not create thin programmatic SEO pages.
13. Preserve the existing visual identity unless a redesign is explicitly requested.
14. Prefer server components and static rendering where appropriate.
15. Use semantic HTML.
16. Keep mobile UX as important as desktop UX.

---

# 1. PRODUCT VISION

The website should become:

> An exam-first academic notes platform for BTech and MTech students.

The product is NOT intended to become a generic AI/ML tutorial website.

Primary user journey:

Course
→ Branch
→ Semester
→ Subject
→ Unit
→ Topic
→ Exam Answer
→ Quick Revision / MCQ / PDF

Primary topic journey:

Learn
→ Understand
→ Write
→ Revise
→ Practice

---

# 2. TARGET INFORMATION ARCHITECTURE

Use this conceptual structure:

/notes
/notes/btech
/notes/btech/{branch}
/notes/btech/{branch}/{subject}
/notes/btech/{branch}/{subject}/{topic}

/notes/mtech
/notes/mtech/{branch}
/notes/mtech/{branch}/{subject}
/notes/mtech/{branch}/{subject}/{topic}

Example:

/notes/mtech/ai-ml/decision-making-under-uncertainty
/notes/mtech/ai-ml/decision-making-under-uncertainty/bayesian-decision-theory

IMPORTANT:
- Do not blindly implement every route above if the existing data model does not support it.
- First inspect the current repository and adapt the route design to the current implementation.
- Keep topic URLs as stable and short as practical.
- Semester/unit can be metadata and navigation rather than necessarily being part of the URL.

---

# 3. PHASE 0 — REPOSITORY AUDIT

## Goal

Understand the existing application before modifying it.

## Agent tasks

Inspect:

- package.json
- next.config.*
- tsconfig.json
- src/app/**
- src/components/**
- src/lib/**
- src/content/**
- Markdown files
- layout files
- metadata configuration
- sitemap
- robots
- existing search implementation
- existing dark mode
- existing PDF implementation
- existing note routing

Create:

`docs/current-architecture.md`

Include:

- framework/version
- routing structure
- content structure
- component structure
- current data model
- existing SEO implementation
- known technical debt
- current build command
- current problems
- recommended minimal changes

Do not implement product changes during this phase.

## Verification

Run:

`npm run build`

If the build fails, document the failures before continuing.

---

# 4. PHASE 1 — CONTENT DATA MODEL

## Goal

Create a scalable metadata model.

Each note should have enough metadata to support:

- course
- branch
- semester
- subject
- unit
- topic
- slug
- title
- description
- keywords
- related topics
- previous topic
- next topic

Example conceptual metadata:

```ts
type NoteMetadata = {
  slug: string
  title: string
  description: string
  course: string
  branch?: string
  semester?: string
  subject: string
  unit?: string
  order?: number
  keywords?: string[]
  relatedSlugs?: string[]
}
```

Adapt this to the existing implementation instead of replacing it unnecessarily.

## Important

Markdown should remain easy to edit.

Do not put the entire note content into TypeScript.

Keep:

- metadata in frontmatter/data
- note body in Markdown

---

# 5. PHASE 2 — NOTES DIRECTORY

## Goal

Upgrade `/notes`.

It should become the main academic directory.

Recommended structure:

1. Page title
2. Short description
3. Search
4. Course cards
5. Popular subjects
6. Recently updated notes

Example:

Academic Notes

Find notes by course, branch, semester and subject.

[BTech]
[MTech]

Popular Subjects

Recently Updated

## UX

A student should understand where to click within 3 seconds.

---

# 6. PHASE 3 — COURSE PAGES

Create/upgrade:

`/notes/btech`
`/notes/mtech`

Each page should contain:

- H1
- description
- available branches
- popular subjects
- latest notes
- breadcrumbs
- internal links

Example:

BTech Notes

Complete BTech study notes organized by branch, semester and subject.

---

# 7. PHASE 4 — BRANCH PAGES

Example:

`/notes/btech/cse`
`/notes/btech/ai-ml`
`/notes/mtech/ai-ml`

Each branch page should contain:

- H1
- course/branch description
- semester sections
- subjects
- note counts where available
- popular topics
- latest notes
- breadcrumbs

Do not display empty semesters or branches.

---

# 8. PHASE 5 — SUBJECT PAGES

This is a high-priority SEO page type.

Example:

`/notes/btech/cse/machine-learning`

Structure:

H1: Machine Learning Notes

Short introductory paragraph.

Then:

## Units

Unit 1
- Topic
- Topic
- Topic

Unit 2
- Topic
- Topic
- Topic

Then:

## Important Questions

Then:

## Quick Revision

Then:

## Related Subjects / Topics

Each topic must link to its canonical note page.

---

# 9. PHASE 6 — PERFECT ONE TOPIC PAGE

Before applying changes to every note, make ONE excellent reference implementation.

Use:

`Decision Tree`

as the reference topic if it exists.

Topic page structure:

Breadcrumbs

Title

Course / Branch / Subject / Unit metadata

Short introduction

Exam navigation:

[2 Marks]
[5 Marks]
[10 Marks]
[Quick Revision]

Then:

## Definition

## 2-Mark Answer

## 5-Mark Answer

## 10-Mark Answer

## Diagram

## How It Works

## Example

## Important Concepts

## Advantages

## Disadvantages

## Applications

## Important Exam Questions

## Quick Revision

## Related Topics

## Previous / Next Topic

---

# 10. EXAM ANSWER DESIGN

The exam-answer section is a core product differentiator.

Use clear visual hierarchy.

For example:

Exam-Ready Answer

[Copy Answer]

The answer should be easy to read on mobile.

Do not make the page look like a generic blog.

Students should be able to quickly locate the answer they need.

---

# 11. QUICK REVISION

Every sufficiently detailed topic should support a concise revision section.

Example:

Quick Revision

- Definition
- Key formula/concept
- Main steps
- Advantages
- Limitations
- Important keywords

Keep it genuinely useful.

Do not automatically generate meaningless bullet points.

---

# 12. IMPORTANT QUESTIONS

Each topic should eventually support:

Important Exam Questions

1. Explain ...
2. Compare ...
3. Discuss ...
4. Derive ...
5. List advantages ...

Questions should be based on actual topic content or syllabus material.

Do not invent claims about university exams unless the source is known.

---

# 13. BREADCRUMBS

Every deep page should show:

Home
→ Notes
→ Course
→ Branch
→ Subject
→ Topic

Use semantic links.

Breadcrumb labels should match the actual hierarchy.

Add appropriate BreadcrumbList structured data if useful.

---

# 14. PREVIOUS / NEXT NAVIGATION

At the bottom of topic pages:

Previous Topic
Next Topic

Navigation must respect the subject/unit ordering.

Do not sort alphabetically unless that is the intended curriculum order.

---

# 15. RELATED TOPICS

Each topic should have related topics.

Example:

Related Topics

- Random Forest
- SVM
- Logistic Regression

Only show links that actually exist.

Never generate broken links.

---

# 16. SEARCH

Upgrade the existing search if present.

Search should support:

- title
- subject
- topic
- keywords
- course
- branch

Examples:

decision tree
pca
svm
machine learning
decision tree 10 marks

Search result should show context:

Decision Tree

BTech → CSE → Machine Learning → Unit 2

Search must not navigate to nonexistent pages.

If there are many notes, use a scalable search approach rather than loading huge content into the client unnecessarily.

---

# 17. SEO METADATA

Every indexable page needs:

- unique title
- unique description
- canonical URL
- Open Graph metadata
- appropriate robots configuration

Example homepage title:

AI & ML Notes for BTech & MTech | Exam Notes, 10-Mark Answers

Example topic title:

Decision Tree in Machine Learning | 10-Mark Exam Answer

Do not keyword-stuff titles.

Descriptions should describe the actual page.

---

# 18. URL RULES

URLs must:

- use lowercase
- use hyphens
- avoid random IDs
- remain stable
- be descriptive
- avoid unnecessary query parameters

Good:

`/notes/mtech/ai-ml/decision-tree`

Bad:

`/notes?id=123`

Avoid changing an existing public URL without a redirect.

---

# 19. SITEMAP

Implement a dynamic sitemap using the current Next.js architecture.

Include:

- homepage
- notes directory
- course pages
- branch pages
- subject pages
- valid topic pages

Exclude:

- nonexistent pages
- duplicate URLs
- internal-only routes
- search query URLs

The sitemap must update automatically when notes are added.

---

# 20. ROBOTS.TXT

Create/verify:

`/robots.txt`

It should allow normal crawling of public content and point crawlers to the sitemap.

Do not accidentally block:

- CSS
- JS
- images
- public notes

---

# 21. STRUCTURED DATA

Use structured data only where it accurately represents visible page content.

Potential types:

- WebSite
- BreadcrumbList
- Article / educational content where appropriate

Do not add fake reviews, ratings, questions or other structured data that is not visible on the page.

Validate generated JSON-LD.

---

# 22. INTERNAL LINKING

Every topic should connect to:

- parent subject
- parent branch/course
- related topics
- previous topic
- next topic

Every subject should link to:

- all units
- all topics
- related subjects

Every course/branch page should link deeper.

Goal:

No important note should be an orphan page.

---

# 23. FOOTER

Create a useful footer containing links to:

- BTech Notes
- MTech Notes
- AI & ML Notes
- Quick Revision
- MCQs
- About
- Contact
- Privacy Policy
- Terms
- Sitemap

Do not add links to pages that do not exist.

---

# 24. ABOUT PAGE

Create:

`/about`

Explain:

- purpose of the website
- target students
- exam-focused approach
- how notes are structured
- correction/update approach

Do not invent a fake company/team.

---

# 25. CONTACT PAGE

Create:

`/contact`

Include a simple way to report:

- wrong content
- broken link
- missing topic
- syllabus request

Keep implementation simple initially.

---

# 26. REQUEST NOTES

Create a lightweight request feature.

Fields:

- course
- branch
- semester
- subject
- university
- requested topic

Initially this can be a simple form or mail/contact workflow.

Do not introduce authentication unless required.

---

# 27. MOBILE UX

Test every important page at mobile width.

Check:

- navigation
- cards
- buttons
- tables
- diagrams
- headings
- long answers
- code blocks
- search
- copy buttons
- breadcrumbs

Exam actions should be easy to tap.

Avoid horizontal scrolling except where unavoidable.

---

# 28. DARK MODE

Preserve the existing dark mode.

Verify:

- cards
- Markdown
- tables
- code
- diagrams
- buttons
- breadcrumbs
- search
- footer

No unreadable low-contrast text.

PDF/print output should remain readable.

---

# 29. PERFORMANCE

Do not add heavy libraries without a strong reason.

Prefer:

- server rendering/static generation
- optimized images
- minimal client JavaScript
- lazy loading for non-critical media
- reusable components

After implementation, run a production build.

---

# 30. CONTENT QUALITY RULES

This is critical for SEO.

Do not create pages like:

"Decision Tree Notes"

with only:

"Decision tree is a machine learning algorithm."

Every indexable page should provide meaningful value.

A topic page should ideally contain:

- explanation
- exam answers
- examples
- diagram where useful
- important questions
- revision
- related topics

Do not mass-generate thin pages.

---

# 31. MCQ SYSTEM — PHASE 2

Do NOT implement this before the notes architecture is stable.

Later create:

`/mcqs`

Features:

- subject selection
- unit selection
- question
- options
- answer
- explanation
- score
- retry
- review

Start with static/local content.

Authentication is not initially required.

---

# 32. PDF SYSTEM — PHASE 2

Later support:

- topic PDF
- subject PDF
- semester PDF

PDF must be printable and readable.

Do not make PDF generation block normal note-page rendering.

---

# 33. EXAM MODE — FUTURE

Future feature:

Course
→ Branch
→ Subject
→ Unit

Then generate/display:

- important questions
- 2-mark questions
- 5-mark questions
- 10-mark questions
- quick revision

Do not implement until the underlying content model is reliable.

---

# 34. MONETIZATION — FUTURE

Do not add payments now.

Potential future products:

- complete subject PDF
- semester bundle
- exam revision bundle

First prove traffic and student usage.

---

# 35. ANALYTICS / SEARCH CONSOLE

After technical SEO is stable:

- connect Google Search Console
- submit sitemap
- monitor indexing
- monitor queries
- monitor pages
- monitor CTR
- monitor Core Web Vitals

Do not assume SEO changes produce immediate results.

Measure over weeks.

---

# 36. DEVELOPMENT ORDER

Implement exactly in this order:

## P0

1. Repository audit
2. Data model
3. `/notes`
4. Course pages
5. Branch pages
6. Subject pages
7. One perfect topic page
8. Topic template
9. Breadcrumbs
10. Previous/Next
11. Related topics
12. Internal links
13. Metadata
14. Sitemap
15. Robots
16. Build verification

## P1

17. Search
18. Quick Revision
19. Important Questions
20. About
21. Contact
22. Request Notes
23. Mobile polish
24. Performance improvements

## P2

25. MCQs
26. PDF improvements
27. Exam Mode
28. Monetization

---

# 37. HOW THE AGENT MUST WORK

For each phase:

### Step A — Inspect

Tell me which files will be affected.

### Step B — Plan

Explain the smallest implementation plan.

### Step C — Implement

Make the changes.

### Step D — Verify

Run:

`npm run build`

Also run available lint/type checks.

### Step E — Review

Check:

- broken routes
- broken links
- metadata
- mobile layout
- TypeScript errors
- console errors

### Step F — Report

Return:

- files changed
- features completed
- tests/build status
- remaining issues

Then stop and wait for the next phase.

Do NOT automatically start the next phase.

---

# 38. GIT SAFETY

Before a major phase:

- check git status
- do not overwrite unrelated work
- do not remove user content
- do not reset the repository
- do not force push
- do not change environment secrets

If a destructive change is required, ask first.

---

# 39. DEFINITION OF DONE

A phase is complete only when:

- feature works
- TypeScript passes
- production build passes
- important routes load
- no obvious broken links
- mobile layout is acceptable
- existing notes still work
- existing functionality is not unnecessarily broken

---

# 40. FIRST TASK TO GIVE ANTIGRAVITY

Start with ONLY this:

> Audit the existing AI & ML Notes repository.
>
> Do not modify application code.
>
> Inspect the routing, components, content model, Markdown files, SEO implementation, metadata, sitemap, robots, search, dark mode and note pages.
>
> Create `docs/current-architecture.md` describing the current implementation and recommending the minimum changes required to implement this product plan.
>
> Run the production build and report any existing errors.
>
> Stop after the audit. Do not implement Phase 1 yet.

After it completes, review the audit before proceeding.

---

# 41. SECOND TASK

After reviewing the audit, give Antigravity:

> Implement Phase 1 — scalable note metadata/data model from `docs/AI_ML_NOTES_PRODUCT_PLAN.md`.
>
> First inspect the existing implementation.
>
> Preserve existing Markdown content and existing public URLs.
>
> Do not redesign the UI.
>
> Do not implement search, MCQs, PDFs or authentication.
>
> Run the production build after changes.
>
> Stop and report changed files and verification results.

---

# 42. THIRD TASK

> Implement Phase 2 — upgrade the `/notes` directory.
>
> Use the existing architecture and components.
>
> Add course-first navigation for BTech and MTech.
>
> Keep the existing visual style.
>
> Make the page mobile-friendly.
>
> Add proper headings, descriptions and internal links.
>
> Do not implement branch/subject/topic pages yet unless required by the existing architecture.
>
> Run the production build and verify `/notes`.
>
> Stop after Phase 2.

---

# 43. FOURTH TASK

> Implement Phase 3 — course pages.
>
> Create/upgrade BTech and MTech note landing pages using the existing content model.
>
> Add breadcrumbs, descriptions, available branches and valid internal links.
>
> Do not create empty branches.
>
> Add unique SEO metadata.
>
> Verify all routes and run the production build.
>
> Stop after Phase 3.

---

# 44. FIFTH TASK

> Implement Phase 4 — branch pages.
>
> Build the branch-level navigation from the existing metadata.
>
> Organize subjects by semester where metadata exists.
>
> Do not invent missing academic information.
>
> Add breadcrumbs and internal links.
>
> Add unique metadata.
>
> Run build and verify representative routes.
>
> Stop after Phase 4.

---

# 45. SIXTH TASK

> Implement Phase 5 — subject pages.
>
> Build subject landing pages from the existing note metadata.
>
> Display units and topics in curriculum order.
>
> Add descriptions, breadcrumbs, related topics and latest/available notes where supported.
>
> Do not create thin pages.
>
> Add unique SEO metadata.
>
> Run build and verify representative subject routes.
>
> Stop after Phase 5.

---

# 46. SEVENTH TASK — MOST IMPORTANT

> Implement Phase 6 — create one excellent exam-focused topic page.
>
> Use Decision Tree as the reference topic if it exists.
>
> Do not change every note yet.
>
> Create the reusable topic-page component/template.
>
> Include:
> - breadcrumbs
> - topic metadata
> - 2-mark section
> - 5-mark section
> - 10-mark section
> - diagram area where content supports it
> - explanation
> - example
> - advantages/disadvantages
> - important questions
> - quick revision
> - related topics
> - previous/next navigation
>
> Keep the design clean and mobile-first.
>
> Run build and inspect the rendered page.
>
> Stop and wait for approval before applying the template to all notes.

---

# 47. FINAL PRINCIPLE

Build the platform from the inside out:

Content model
→ Information architecture
→ Navigation
→ Topic experience
→ SEO
→ Search
→ Student tools
→ Monetization

Do not start with animations.

Do not start with authentication.

Do not start with an AI chatbot.

Make the notes themselves excellent first.

---

# REFERENCE

Antigravity supports workspace rules and workflows through Markdown files, making this plan suitable for an agent-driven implementation workflow.

Recommended project documentation:

`docs/AI_ML_NOTES_PRODUCT_PLAN.md`

Recommended Antigravity rule:

`.agents/rules/ai-ml-notes.md`

Recommended future workflows:

`.agents/workflows/audit.md`
`.agents/workflows/implement-phase.md`
`.agents/workflows/seo-check.md`
`.agents/workflows/verify-build.md`
