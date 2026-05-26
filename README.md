# mfm-h5-rank

济南买房么 · **房产榜单 H5**（独立部署，供微信小程序 `web-view` 加载）。

## 技术栈（与房小团对齐）

- **Vue 3 + Vue Router + Vite**（非 uni-app 运行时；原站 FXT 为 uni-app 打出的 H5 静态包）
- 路径前缀 **`/v2/pages/…`**（与 `fxt-mobile.huanjutang.com/v2/pages/…` 一致）
- `index.html` 引入 **`uni.webview.1.5.4.js`**、**jweixin**，便于小程序内 `uni.navigateBack` 等

## 开发

```bash
pnpm install
cp .env.example .env
pnpm dev
```

浏览器访问示例：`http://127.0.0.1:5180/v2/pages/tools/app-list/rank`

开发时代理：`/api/*` → `VITE_API_BASE_URL`（去掉 `/api` 前缀后转发到 FastAPI）。

## 构建与部署

```bash
pnpm build
```

产物在 `dist/`，需由 Nginx 等以 **`/v2/`** 为 base 托管（见 `vite.config.ts` 的 `base`）。

小程序环境变量（`mfm-uniapp-vue3`）：

```bash
VITE_MFM_H5_ORIGIN=https://你的H5域名
```

`web-view` 将加载：`{origin}/v2/pages/data/sell-rank?…`

## 路由表

见 `src/config/rank-routes.ts`，与小程序 `property-rank-h5.ts` 的 `deployPath` 一致。
