/**
 * mfm-h5 doc · Diátaxis 四象限导航
 */
(function (global) {
  var C4_WORKSPACE = "../mfm-uniapp-vue3/doc/explanation/c4-workspace.html"

  var NAV = [
    { id: "index", href: "index.html", label: "文档门户", group: "入口" },
    { id: "tutorial-index", href: "tutorial/index.html", label: "Tutorial · 门户", group: "Tutorial" },
    { id: "tutorial-getting-started", href: "tutorial/tutorial-getting-started.html", label: "入门教程", group: "Tutorial" },
    { id: "how-to-index", href: "how-to/index.html", label: "How-to · 门户", group: "How-to" },
    { id: "reference-index", href: "reference/index.html", label: "Reference · 门户", group: "Reference" },
    { id: "rank-module", href: "reference/rank-module.html", label: "房产榜单模块", group: "Reference" },
    { id: "explanation-index", href: "explanation/index.html", label: "Explanation · 门户", group: "Explanation" },
    { id: "c4-workspace", href: C4_WORKSPACE, label: "C4 Workspace · L1", group: "Explanation" },
    { id: "c4-container", href: "explanation/c4-container.html", label: "C4 Container · L2", group: "Explanation" },
    { id: "c4-component", href: "explanation/c4-component.html", label: "C4 Component · L3", group: "Explanation" },
  ]

  function detectBase() {
    var path = global.location.pathname || ""
    if (
      path.includes("/tutorial/") ||
      path.includes("/how-to/") ||
      path.includes("/reference/") ||
      path.includes("/explanation/")
    )
      return "../"
    return "./"
  }

  function renderSidebar(container, activeId, base) {
    if (!container) return
    var groups = {}
    NAV.forEach(function (item) {
      if (!groups[item.group]) groups[item.group] = []
      groups[item.group].push(item)
    })
    var html =
      '<div class="brand"><div class="eyebrow">Diátaxis</div><h2>mfm-h5</h2><p>独立 H5 SPA</p></div>'
    Object.keys(groups).forEach(function (group) {
      html += '<div class="nav-label">' + group + '</div><nav class="nav">'
      groups[group].forEach(function (item) {
        var href = item.href.indexOf("../") === 0 ? item.href : base + item.href
        var cls = item.id === activeId ? ' class="is-active" aria-current="page"' : ""
        html += '<a href="' + href + '"' + cls + ">" + item.label + "</a>"
      })
      html += "</nav>"
    })
    html += '<div class="side-note">壳 URL 真值在 mfm-api <code>page_config.webviewSrc</code>。</div>'
    container.innerHTML = html
  }

  function renderBreadcrumb(container, title, base) {
    if (!container) return
    container.innerHTML =
      '<a href="' +
      base +
      'index.html">文档门户</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">' +
      title +
      "</span>"
  }

  function initPortalSearch() {
    var input = document.getElementById("doc-search")
    var cards = document.querySelectorAll("[data-doc-card]")
    var tags = document.querySelectorAll(".filter-tag")
    if (!input && !tags.length) return
    var activeTag = "all"
    function filter() {
      var q = (input && input.value ? input.value : "").trim().toLowerCase()
      cards.forEach(function (card) {
        var text = (card.textContent || "").toLowerCase()
        var tag = card.getAttribute("data-tag") || ""
        var matchQ = !q || text.indexOf(q) >= 0
        var matchTag = activeTag === "all" || tag === activeTag
        card.classList.toggle("is-hidden", !(matchQ && matchTag))
      })
    }
    if (input) input.addEventListener("input", filter)
    tags.forEach(function (tagEl) {
      tagEl.addEventListener("click", function () {
        tags.forEach(function (t) {
          t.classList.remove("is-active")
        })
        tagEl.classList.add("is-active")
        activeTag = tagEl.getAttribute("data-filter") || "all"
        filter()
      })
    })
  }

  function init(opts) {
    opts = opts || {}
    var base = detectBase()
    if (opts.portal) {
      initPortalSearch()
      return
    }
    renderSidebar(document.getElementById("doc-sidebar"), opts.pageId || "", base)
    renderBreadcrumb(document.getElementById("doc-breadcrumb"), opts.title || document.title, base)
    var back = document.getElementById("doc-back-home")
    if (back) back.setAttribute("href", base + "index.html")
  }

  global.DocShell = { init: init, NAV: NAV, C4_WORKSPACE: C4_WORKSPACE }
})(typeof window !== "undefined" ? window : globalThis)
