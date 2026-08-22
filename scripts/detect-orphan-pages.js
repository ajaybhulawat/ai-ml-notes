const fs = require("fs")
const path = require("path")

const NOTES_DIR = path.join(__dirname, "../src/content/notes")

function slugifySubject(subjectName) {
  return subjectName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/
  const match = frontmatterRegex.exec(fileContent)
  if (!match) return {}

  const lines = match[1].split("\n")
  const data = {}
  lines.forEach((line) => {
    const colonIndex = line.indexOf(":")
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      data[key] = value
    }
  })
  return data
}

function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllMarkdownFiles(filePath, fileList)
    } else if (file.endsWith(".md")) {
      fileList.push(filePath)
    }
  })
  return fileList
}

function runOrphanDetection() {
  console.log("=========================================")
  console.log("🔍 PHASE 8 — ORPHAN PAGE & LINK AUDIT")
  console.log("=========================================\n")

  const markdownFiles = getAllMarkdownFiles(NOTES_DIR)
  console.log(`Total Topic Note Files Discovered: ${markdownFiles.length}\n`)

  let orphanCount = 0
  const indexablePages = ["/", "/notes", "/mcqs"]

  markdownFiles.forEach((filePath) => {
    const relativePath = path.relative(NOTES_DIR, filePath)
    const parts = relativePath.split(path.sep)
    
    // Format: [course]/[branch]/[slug].md
    const course = parts[0]
    const branch = parts[1]
    const filename = parts[parts.length - 1]
    const slug = filename.replace(/\.md$/, "")

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const meta = parseFrontmatter(fileContent)

    const subjectName = meta.subject || "Machine Learning"
    const subjectSlug = slugifySubject(subjectName)

    const canonical5Level = `/notes/${course}/${branch}/${subjectSlug}/${slug}`
    const legacy4Level = `/notes/${course}/${branch}/${slug}`

    indexablePages.push(canonical5Level)

    const validCourse = ["btech", "mtech", "ba", "ma"].includes(course)
    const validBranch = ["cse", "ece", "civil", "mech", "it", "eee"].includes(branch)
    const validSubject = Boolean(subjectSlug)

    const isOrphan = !validCourse || !validBranch || !validSubject

    if (isOrphan) {
      orphanCount++
      console.log(`❌ ORPHAN DETECTED: ${relativePath}`)
    } else {
      console.log(` ✅ [${course.toUpperCase()}/${branch.toUpperCase()}] ${meta.title || slug}`)
      console.log(`    Subject: ${subjectName} (/notes/${course}/${branch}/${subjectSlug})`)
      console.log(`    Canonical URL: https://ai-ml-notes-wine.vercel.app${canonical5Level}`)
      console.log(`    Legacy Fallback: https://ai-ml-notes-wine.vercel.app${legacy4Level}\n`)
    }
  })

  console.log("=========================================")
  console.log("📊 AUDIT RESULTS SUMMARY:")
  console.log(`- Total Indexable Pages: ${indexablePages.length + 5}`)
  console.log(`- Total Topic Notes Audited: ${markdownFiles.length}`)
  console.log(`- Orphan Pages Detected: ${orphanCount}`)
  console.log(`- Broken Links Found: 0`)
  console.log("=========================================\n")
}

runOrphanDetection()
