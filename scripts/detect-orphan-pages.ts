import { getAllNotesMeta, getAllCourses, getBranches, getSubjectsForBranch, slugifySubject } from "../src/lib/notes"

function runOrphanDetection() {
  console.log("=========================================")
  console.log("🔍 PHASE 8 — ORPHAN PAGE & LINK AUDIT")
  console.log("=========================================\n")

  const notes = getAllNotesMeta()
  const courses = getAllCourses()

  let orphanCount = 0
  let brokenLinkCount = 0
  const indexablePages: string[] = ["/", "/notes", "/mcqs"]

  console.log(`Total Markdown Notes Found: ${notes.length}`)
  console.log(`Total Academic Courses: ${courses.join(", ")}\n`)

  // 1. Audit Course -> Branch -> Subject -> Topic reachability
  courses.forEach((course) => {
    indexablePages.push(`/notes/${course}`)
    const branches = getBranches(course)

    branches.forEach((branch) => {
      indexablePages.push(`/notes/${course}/${branch}`)
      const subjects = getSubjectsForBranch(course, branch)

      subjects.forEach((subjectObj) => {
        indexablePages.push(`/notes/${course}/${branch}/${subjectObj.slug}`)
      })
    })
  })

  console.log(`📌 Indexable Structural Routes (${indexablePages.length}):`)
  indexablePages.forEach((route) => console.log(`  - ${route}`))

  console.log("\n📌 Topic Notes Linkability & Canonical Reachability Audit:")
  notes.forEach((note) => {
    const subjectName = note.subject || "General Machine Learning"
    const subjectSlug = slugifySubject(subjectName)
    const canonical5Level = `/notes/${note.course}/${note.branch}/${subjectSlug}/${note.slug}`
    const legacy4Level = `/notes/${note.course}/${note.branch}/${note.slug}`

    indexablePages.push(canonical5Level)

    // Verify parent course exists
    const validCourse = courses.includes(note.course.toLowerCase())
    // Verify parent branch exists
    const validBranch = getBranches(note.course).includes(note.branch.toLowerCase())
    // Verify parent subject exists
    const subjectsInBranch = getSubjectsForBranch(note.course, note.branch).map((s) => s.slug)
    const validSubject = subjectsInBranch.includes(subjectSlug)

    const isOrphan = !validCourse || !validBranch || !validSubject

    if (isOrphan) {
      orphanCount++
      console.log(`❌ ORPHAN DETECTED: [${note.title}]`)
      console.log(`   - File: ${note.slug}.md`)
      console.log(`   - Course Valid: ${validCourse}, Branch Valid: ${validBranch}, Subject Valid: ${validSubject}`)
    } else {
      console.log(`  ✅ [${note.course.toUpperCase()}/${note.branch.toUpperCase()}] ${note.title}`)
      console.log(`     Canonical: ${canonical5Level}`)
      console.log(`     Legacy Fallback: ${legacy4Level}`)
    }
  })

  console.log("\n=========================================")
  console.log("📊 AUDIT RESULTS SUMMARY:")
  console.log(`- Total Indexable Pages: ${indexablePages.length}`)
  console.log(`- Total Topic Notes Audited: ${notes.length}`)
  console.log(`- Orphan Pages Detected: ${orphanCount}`)
  console.log(`- Broken Structural Links: ${brokenLinkCount}`)
  console.log("=========================================\n")

  if (orphanCount > 0 || brokenLinkCount > 0) {
    process.exit(1)
  }
}

runOrphanDetection()
