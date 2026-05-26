# 济南买房么 · 独立 H5（`mfm-h5`）

本仓库是 **与小程序分离部署** 的 H5 站点：承载房小团式 ``/v2/pages/…`` 页面，供 **微信小程序 `web-view`**、H5 外链等加载。**不要**把页面真值写进 `mfm-uniapp-vue3`。

**相关**：小程序见 **`../mfm-uniapp-vue3/AGENTS.md`**；后端见 **`../mfm-api/AGENTS.md`**。

---

## §0 快速开始

```bash
pnpm install
cp .env.example .env.development.local   # 或 .env
pnpm dev:h5       # 与 uni-app 仓 dev:h5 同名；默认 http://127.0.0.1:5180
pnpm build:h5     # 产物 dist/，base /v2/
pnpm preview:h5   # 预览构建产物（联调优先 dev:h5）
pnpm docs:pages   # 从 registry 生成 doc/pages/*/*.html
```

小程序联调：`web-view` URL 由 **`mfm-api`** `page_config.props.webviewSrc` 下发。本地在 API `.env` 设 `MFM_API_H5_PUBLIC_ORIGIN=http://<局域网IP>:5180`（与 `pnpm dev:h5` 端口一致），seed 后重启 API。

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

## §2 架构要点（两层边界）

| 层 | 谁 | 配置 / 导航 | 发版 |
|----|-----|-------------|------|
| **壳** | `mfm-uniapp-vue3` 仅 ``base-h5-webview-page`` + ``page-key`` | ``GET /config/page`` → ``props.webviewSrc``（**真值**）；改 H5 入口 URL **不需**发小程序 |
| **页** | 本仓库 SPA | ``rank-routes.ts`` 只做 **Vue Router 路径注册**；站内 ``router.push``、RankHub 网格等 **可在 H5 内迭代** | 部署 ``dist/`` 即可 |

| 项 | 说明 |
|----|------|
| 技术栈 | **Vue 3 + Vue Router + Vite**（非 uni-app 运行时；对齐 FXT ``/v2/pages/…`` URL） |
| 公开路径 | ``{origin}/v2/pages/<deployPath>``，须与 **mfm-api** ``page_config.props.webviewSrc`` 路径一致 |
| 小程序桥 | ``uni.webview.1.5.4.js``；返回优先 ``uni.navigateBack()`` |
| 业务 API | 子榜页内 ``fetch`` mfm-api（如 ``GET /data/sell-rank``）；**不是** ``/config/page`` |

```text
小程序壳 page-key=data-sell-rank
  → page_config.webviewSrc = {H5}/v2/pages/data/sell-rank   ← 运营可改、免小程序发版
      → mfm-h5 匹配路由 → SellRank.vue
          → GET /data/sell-rank
榜单中心 H5 内 router.push('/pages/…')  ← 仅 SPA 内跳转，随 H5 部署更新
```

---

## §3 已落地模块

### 房产榜单（`rank`）

- **壳 URL 真值**：mfm-api ``page_config``（各 ``*-rank`` 的 ``webviewSrc``）；小程序已全用 ``page-key``
- **H5 路由表**：`src/config/rank-routes.ts`（与 ``webviewSrc`` 路径对齐，供 Vite/站内跳转）
- 页面文档：`doc/pages/rank/*.html`（由 ``registry.json`` 生成）

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

- 在 `mfm-uniapp-vue3` 壳页写死 H5 完整 URL（须 ``page-key`` + ``page_config``）。
- 在 `mfm-uniapp-vue3` 实现榜单业务 UI（真值在本仓库 + 业务 API）。
- 把 ``rank-routes.ts`` 当成运营配置源同步给小程序（小程序只认 ``webviewSrc``）。
- 引入 uni-app / uView 运行时（保持轻量 SPA）。
- 修改 ``/v2/`` 路径而不同步 **``page_config.webviewSrc``**、``rank-routes.ts``、``doc/pages/rank/registry.json``。

---

_文档快照：2026-05-26_
