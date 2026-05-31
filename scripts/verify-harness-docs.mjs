/**
 * Harness 文档校对：doc/ Diátaxis 关键页。
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..")

const DOC_REQUIRED = [
  "doc/index.html",
  "doc/tutorial/index.html",
  "doc/tutorial/getting-started.html",
  "doc/how-to/index.html",
  "doc/reference/index.html",
  "doc/reference/rank.html",
  "doc/reference/rank/registry.json",
  "doc/explanation/index.html",
  "doc/explanation/c4-container.html",
  "doc/explanation/c4-component.html",
  "doc/assets/style.css",
  "doc/assets/common.js",
]

function main() {
  const errors = DOC_REQUIRED.filter((rel) => !existsSync(join(root, rel))).map(
    (rel) => `missing: ${rel}`,
  )
  const commonJs = join(root, "doc/assets/common.js")
  if (existsSync(commonJs)) {
    const src = readFileSync(commonJs, "utf8")
    for (const q of ["tutorial/", "how-to/", "reference/", "explanation/"]) {
      if (!src.includes(q)) errors.push(`common.js missing ${q}`)
    }
  }
  if (errors.length) {
    console.error("verify-harness-docs:")
    errors.forEach((line) => console.error(line))
    process.exit(1)
  }
  console.log(`verify-harness-docs: OK (${DOC_REQUIRED.length} paths)`)
}

main()
