/**
 * 从 doc/reference/<module>/registry.json 生成各页面 HTML 文档（Reference 象限）。
 * 运行：pnpm docs:pages
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const referenceRoot = path.join(root, "doc", "reference")

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function statusTag(status) {
  const map = {
    done: ["tag--ok", "已落地"],
    stub: ["tag--warn", "演示/壳"],
    placeholder: ["tag--muted", "占位"],
  }
  const [cls, label] = map[status] || ["", status]
  return `<span class="tag ${cls}">${esc(label)}</span>`
}

function renderPageDoc(module, modMeta, page) {
  const devUrl = `http://127.0.0.1:5180/v2${page.routerPath}`
  const prodUrl = `{H5_ORIGIN}/v2/pages/${page.deployPath}`
  const apiRow = page.api
    ? `<tr><th>后端 API</th><td><code>${esc(page.api)}</code></td></tr>`
    : `<tr><th>后端 API</th><td class="muted">—</td></tr>`

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(page.title)} · mfm-h5 · ${esc(modMeta.title)}</title>
  <link rel="stylesheet" href="../../assets/style.css" />
</head>
<body>
  <div class="portal">
    <a class="back-home" href="../../index.html">← 文档门户</a>
    <nav class="breadcrumb" aria-label="面包屑">
      <a href="../../index.html">mfm-h5</a>
      <span class="breadcrumb-sep">/</span>
      <a href="../${module}.html">${esc(modMeta.title)}</a>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">${esc(page.title)}</span>
    </nav>

    <header class="hero">
      <div class="eyebrow muted">${esc(modMeta.title)} · Reference · 页面契约</div>
      <h1>${esc(page.title)}</h1>
      <p class="lead">${esc(page.notes || "")}</p>
      ${statusTag(page.status)}
    </header>

    <section class="content-panel">
      <h2>URL 与路由</h2>
      <div class="table-wrap">
        <table>
          <tbody>
            <tr><th>页面 ID</th><td><code>${esc(page.id)}</code></td></tr>
            <tr><th>部署路径 deployPath</th><td><code>${esc(page.deployPath)}</code></td></tr>
            <tr><th>Vue Router</th><td><code>${esc(page.routerPath)}</code></td></tr>
            <tr><th>本地开发 URL</th><td><a href="${esc(devUrl)}" target="_blank" rel="noopener"><code>${esc(devUrl)}</code></a></td></tr>
            <tr><th>生产 URL 模板</th><td><code>${esc(prodUrl)}</code></td></tr>
            <tr><th>SFC 实现</th><td><code>${esc(page.view)}</code></td></tr>
            <tr><th>小程序 web-view 壳</th><td><code>${esc(page.mpShellPath)}</code></td></tr>
            ${apiRow}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-panel">
      <h2>参考</h2>
      <ul>
        <li>路由真值：<code>src/config/rank-routes.ts</code></li>
        <li>模块索引：<a href="../${module}.html">${esc(modMeta.title)} 模块</a></li>
        <li>架构：<a href="../../explanation/c4-container.html">C4 Container · L2</a></li>
      </ul>
    </section>
  </div>
</body>
</html>
`
}

function renderModuleIndex(module, modMeta) {
  const rows = modMeta.pages
    .map(
      (p) => `<tr>
        <td><a href="./${module}/${p.id}.html">${esc(p.title)}</a></td>
        <td><code>${esc(p.deployPath)}</code></td>
        <td>${statusTag(p.status)}</td>
        <td><code>${esc(p.view)}</code></td>
      </tr>`,
    )
    .join("\n")

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(modMeta.title)} · mfm-h5 Reference</title>
  <link rel="stylesheet" href="../assets/style.css" />
</head>
<body>
  <div class="portal">
    <a class="back-home" href="../index.html">← 文档门户</a>
    <header class="hero">
      <div class="eyebrow muted">Reference · 页面模块</div>
      <h1>${esc(modMeta.title)}</h1>
      <p class="lead">${esc(modMeta.description)}</p>
    </header>
    <section class="content-panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>页面</th><th>deployPath</th><th>状态</th><th>实现</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  </div>
</body>
</html>
`
}

const modules = fs.readdirSync(referenceRoot, { withFileTypes: true }).filter((d) => d.isDirectory())

for (const dirent of modules) {
  const module = dirent.name
  const registryPath = path.join(referenceRoot, module, "registry.json")
  if (!fs.existsSync(registryPath)) continue
  const modMeta = JSON.parse(fs.readFileSync(registryPath, "utf8"))
  const outDir = path.join(referenceRoot, module)
  for (const page of modMeta.pages) {
    const out = path.join(outDir, `${page.id}.html`)
    fs.writeFileSync(out, renderPageDoc(module, modMeta, page))
    console.log("wrote", path.relative(root, out))
  }
  const indexPath = path.join(referenceRoot, `${module}.html`)
  fs.writeFileSync(indexPath, renderModuleIndex(module, modMeta))
  console.log("wrote", path.relative(root, indexPath))
}

console.log("done")
