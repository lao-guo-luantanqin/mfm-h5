# mfm-h5 · 独立 H5

**相关**：小程序壳 `../mfm-uniapp-vue3/AGENTS.md` · 后端 `../mfm-api/AGENTS.md`。

与小程序**分离部署**的 H5 SPA：承载 `/v2/pages/…`，供微信小程序 `web-view` 与 H5 外链加载。**不要**把页面真值写进 uni-app 仓。

## §0 快速开始

```bash
pnpm install
cp .env.example .env.development.local # 或 .env
pnpm dev:h5 # 默认 http://127.0.0.1:5180
pnpm build:h5 # dist/，base /v2/
pnpm preview:h5
pnpm docs:pages # 从 reference/<module>/registry.json 生成 doc/reference/*
```

小程序联调：`web-view` URL 由 mfm-api **`page_config.props.webviewSrc`** 下发；本地 API `.env` 设 `MFM_API_H5_PUBLIC_ORIGIN=http://<局域网IP>:5180`，seed 后重启 API。详见 **`doc/explanation/c4-container.html`**。

## §1 架构概览

| 层 | 职责 |
|----|------|
| **壳**（uni-app） | `base-h5-webview-page` + `page-key`；入口 URL 真值在 **`page_config.webviewSrc`** |
| **页**（本仓） | Vue 3 + Vue Router + Vite SPA；站内 `router.push`；部署 `dist/` 即可 |

业务 API 由页面 `import api/*` 请求 mfm-api；类型 **`src/types/`** 与后端 JSON 对齐，**不做** api 层字段映射。两层边界与联调流程见 **`doc/explanation/c4-container.html`**。

## §2 目录结构

```text
src/
├── api/           业务接口（路径 + apiGet，无字段映射）
├── types/         与 mfm-api OutBase JSON（camelCase）对齐
├── views/         页面 SFC
├── components/    展示组件
├── config/        路由表（如 rank-routes.ts）· 静态常量
├── utils/         request.ts（唯一 HTTP 客户端）
└── router/

doc/               Diátaxis 四象限 HTML；门户 doc/index.html
scripts/           gen-page-docs.mjs
vite.config.ts     base: /v2/
```

新模块：增 `src/config/<module>-routes.ts` · `src/views/` · `doc/reference/<module>/registry.json`，运行 `pnpm docs:pages`。

## §3 关键约定

1. **公开路径**：`{origin}/v2/pages/<deployPath>` 须与 **`page_config.webviewSrc`** 一致。
2. **小程序桥**：`uni.webview.1.5.4.js`；返回优先 `uni.navigateBack()`。
3. **路由表**（如 `rank-routes.ts`）仅做 Vue Router 注册，**不是**运营配置源；小程序只认 `webviewSrc`。
4. **技术栈**：纯 Vue SPA，**不**引入 uni-app / uView 运行时。
5. **文档分层**：短规则在本文；页面契约见 **`doc/reference/<module>/`**，门户 **`doc/index.html`**。

## §4 文档地图（Diátaxis）

| 象限 | 门户 | 要点 |
|------|------|------|
| **Tutorial** | `doc/tutorial/index.html` | 入门：`tutorial-getting-started.html` |
| **How-to** | `doc/how-to/index.html` | `pnpm docs:pages`、构建 |
| **Reference** | `doc/reference/index.html` | 榜单等页面契约 `reference/rank/` |
| **Explanation** | `doc/explanation/index.html` | C4 L2/L3 |

| C4 L1 多仓地图 | `../mfm-uniapp-vue3/doc/explanation/c4-workspace.html` |
| doc HTML 命名 | `../mfm-uniapp-vue3/doc/reference/doc-file-naming.html`（五仓统一 `{domain}-{topic}.html`） |

Harness 校对：`pnpm verify:harness` · 公共样式：`doc/assets/style.css` · `doc/assets/common.js`

**用户级技能**（`~/.agents/skills/`）：通用流程与 `git-close-loop` · `html-artifacts` 等；本仓无 `.agents/skills/`。

## §6 Git 闭环与文档影响面

流程技能：**`git-close-loop`**（用户级 `~/.agents/skills/`）。提交前对照下表维护文档与跨仓契约。

| 代码/配置变更 | 优先更新的入口 |
|---------------|----------------|
| 公开路径 / 路由 | `src/config/*-routes.ts` · `pnpm docs:pages` → `doc/reference/<module>/` |
| 页面契约 | `doc/reference/<module>/registry.json` 与生成 HTML |
| C4 · 壳页联调 | `doc/explanation/c4-container.html`；同步 mfm-api **`page_config.webviewSrc`** |
| C4 L1 | `../mfm-uniapp-vue3/doc/explanation/c4-workspace.html` |
| 仅局部实现、无路径/契约变化 | 提交说明注明「文档：无」 |

- 动 `doc/` 或 `registry.json`：`pnpm verify:harness`；合并前 `pnpm build:h5`
- 闭环收尾：`git pull --rebase` → `git push`

## §5 不要做的事

- 在 uni-app 壳页写死 H5 完整 URL（须 `page-key` + `page_config`）。
- 在 uni-app 仓实现榜单等业务 UI（真值在本仓 + 业务 API）。
- 修改 `/v2/` 路径而不同步 **`page_config.webviewSrc`**、`rank-routes.ts`、`registry.json`。
- 在 `utils/request.ts` 外再建第二套 HTTP 客户端。
