/**
 * Harness 文档校对：doc/ Diátaxis 关键页 + HTML slug 命名。
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const docRoot = join(root, "doc")

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)+\.html$/
const QUADRANTS = new Set(["tutorial", "how-to", "reference", "explanation"])

const DOC_REQUIRED = [
  "doc/index.html",
  "doc/tutorial/index.html",
  "doc/tutorial/tutorial-getting-started.html",
  "doc/how-to/index.html",
  "doc/reference/index.html",
  "doc/reference/rank-module.html",
  "doc/reference/rank/registry.json",
  "doc/explanation/index.html",
  "doc/explanation/c4-container.html",
  "doc/explanation/c4-component.html",
  "doc/assets/style.css",
  "doc/assets/common.js",
]

function walkHtmlFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    if (!statSync(abs).isDirectory()) {
      if (name.endsWith(".html")) out.push(abs)
      continue
    }
    if (name === "assets") continue
    walkHtmlFiles(abs, out)
  }
  return out
}

function validateSlug(relFromDoc, baseName) {
  if (baseName === "index.html") return null
  const quadrant = relFromDoc.split("/")[0]
  if (!QUADRANTS.has(quadrant)) {
    return `HTML must live under tutorial|how-to|reference|explanation: ${relFromDoc}/${baseName}`
  }
  if (!SLUG_RE.test(baseName)) {
    return `slug must be kebab-case with domain prefix: ${relFromDoc}/${baseName}`
  }
  return null
}

function extractNavEntries(commonJs) {
  const entries = []
  const re = /\{\s*id:\s*"([^"]+)"[^}]*href:\s*"([^"]+\.html)"/g
  let m
  while ((m = re.exec(commonJs)) !== null) entries.push({ id: m[1], href: m[2] })
  return entries
}

function extractPageId(html) {
  const matches = [...html.matchAll(/DocShell\.init\(\{\s*pageId:\s*"([^"]+)"/g)]
  return matches.length ? matches[matches.length - 1][1] : null
}

function verifyDocNaming() {
  const errors = []
  for (const abs of walkHtmlFiles(docRoot)) {
    const rel = relative(docRoot, abs)
    const baseName = rel.split("/").pop()
    const dirRel = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : ""
    const slugErr = validateSlug(dirRel, baseName)
    if (slugErr) errors.push(slugErr)
  }
  const commonPath = join(docRoot, "assets/common.js")
  if (existsSync(commonPath)) {
    const src = readFileSync(commonPath, "utf8")
    for (const q of ["tutorial/", "how-to/", "reference/", "explanation/"]) {
      if (!src.includes(q)) errors.push(`common.js missing ${q}`)
    }
    for (const { id, href } of extractNavEntries(src)) {
      if (href.startsWith("../")) continue
      const abs = join(docRoot, href)
      if (!existsSync(abs)) {
        errors.push(`NAV href missing file: doc/${href}`)
        continue
      }
      const pageId = extractPageId(readFileSync(abs, "utf8"))
      if (pageId && pageId !== id) {
        errors.push(`pageId mismatch in doc/${href}: DocShell=${pageId} NAV=${id}`)
      }
    }
  }
  return errors
}

function main() {
  const errors = [
    ...DOC_REQUIRED.filter((rel) => !existsSync(join(root, rel))).map((rel) => `missing: ${rel}`),
    ...verifyDocNaming(),
  ]
  if (errors.length) {
    console.error("verify-harness-docs:")
    errors.forEach((line) => console.error(line))
    process.exit(1)
  }
  console.log(`verify-harness-docs: OK (${DOC_REQUIRED.length} paths + naming)`)
}

main()
