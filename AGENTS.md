# 济南买房么 · 独立 H5（`mfm-h5`）

本仓库是 **与小程序分离部署** 的 H5 站点：承载房小团式 ``/v2/pages/…`` 页面，供 **微信小程序 `web-view`**、H5 外链等加载。**不要**把页面真值写进 `mfm-uniapp-vue3`。

**相关**：小程序见 **`../mfm-uniapp-vue3/AGENTS.md`**；后端见 **`../mfm-api/AGENTS.md`**。

---

## §0 快速开始

```bash
pnpm install
cp .env.example .env
pnpm dev          # 默认 http://127.0.0.1:5180
pnpm build        # 产物 dist/，base /v2/
pnpm docs:pages   # 从 registry 生成 doc/pages/*/*.html
```

小程序联调：在 `mfm-uniapp-vue3` 的 `env/.env.development.local` 设置：

```bash
VITE_MFM_H5_ORIGIN=http://<局域网IP>:5180
```

---

## §1 目录结构

```text
mfm-h5/
├── doc/                    # Agent 文档（HTML 真值）
│   ├── index.html          # 门户
│   ├── architecture.html   # 架构与部署
│   ├── assets/             # style.css
│   └── pages/
│       ├── rank.html       # 模块索引（生成）
│       └── rank/           # 各页契约（registry.json + *.html）
├── src/
│   ├── config/             # 路由表（按模块扩展）
│   ├── views/              # 页面 SFC
│   ├── router/
│   └── api/
├── scripts/gen-page-docs.mjs
├── vite.config.ts          # base: /v2/
└── index.html              # uni.webview + jweixin
```

新模块约定：增加 ``src/config/<module>-routes.ts``、``src/views/``、``doc/pages/<module>/registry.json``，运行 ``pnpm docs:pages``。

---

## §2 架构要点

| 项 | 说明 |
|----|------|
| 技术栈 | **Vue 3 + Vue Router + Vite**（非 uni-app 运行时；房小团 H5 为 uni-app 编译产物，我们对齐 URL 与桥，不复制其构建链） |
| 公开路径 | ``{origin}/v2/pages/<deployPath>``，与 FXT ``fxt-mobile.huanjutang.com/v2/pages/…`` 一致 |
| 小程序桥 | ``uni.webview.1.5.4.js``；返回优先 ``uni.navigateBack()`` |
| API | 开发：Vite proxy ``/api`` → ``VITE_API_BASE_URL``；生产：构建时 ``VITE_API_BASE_URL`` 或同源反代 |

```text
小程序 web-view 壳 (mfm-uniapp-vue3)
    → GET {VITE_MFM_H5_ORIGIN}/v2/pages/data/sell-rank
        → 本仓库静态资源 + Vue SPA
            → fetch mfm-api GET /data/sell-rank
```

---

## §3 已落地模块

### 房产榜单（`rank`）

- 路由真值：`src/config/rank-routes.ts`
- 页面文档：`doc/pages/rank/*.html`（由 ``registry.json`` 生成）
- 小程序 ``deployPath`` 对照：`../mfm-uniapp-vue3/src/subpackages/tools/config/property-rank-h5.ts`

---

## §4 文档地图

| 主题 | 文件 |
|------|------|
| 文档门户 | `doc/index.html` |
| 架构与部署 | `doc/architecture.html` |
| 榜单模块索引 | `doc/pages/rank.html` |
| 单页契约 | `doc/pages/rank/<id>.html` |

---

## §5 不要做的事

- 在 `mfm-uniapp-vue3` 的 `subpackages/**/pages/h5/` 新增榜单真值页。
- 引入 uni-app / uView 运行时（保持轻量 SPA）。
- 修改 ``/v2/`` base 或 ``deployPath`` 而不同步小程序 ``property-rank-h5.ts`` 与 ``doc/pages/rank/registry.json``。

---

_文档快照：2026-05-26_
