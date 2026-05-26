# mfm-h5

济南买房么 · **独立 H5 站点**（多页面模块，供微信小程序 `web-view` 加载）。

## 技术栈

- **Vue 3 + Vue Router + Vite**（非 uni-app 运行时；原站 FXT 为 uni-app 打出的 H5 静态包）
- 路径前缀 **`/v2/pages/…`**（与 `fxt-mobile.huanjutang.com/v2/pages/…` 一致）
- `index.html` 引入 **`uni.webview.1.5.4.js`**、**jweixin**，便于小程序内 `uni.navigateBack` 等

## 开发

命令与 **`mfm-uniapp-vue3`** 的 H5 脚本命名一致：

```bash
pnpm install
cp .env.example .env.development.local   # 或 .env
pnpm dev:h5
```

浏览器示例：`http://127.0.0.1:5180/v2/pages/tools/app-list/rank`

开发时代理：`/api/*` → `VITE_API_BASE_URL`（去掉 `/api` 前缀后转发到 FastAPI）。

## 构建与部署

```bash
pnpm build:h5
pnpm preview:h5   # 本地预览 dist/，一般联调直接用 dev:h5
```

产物在 `dist/`，需由 Nginx 等以 **`/v2/`** 为 base 托管（见 `vite.config.ts` 的 `base`）。

## 小程序 web-view 联调

H5 地址由后端 **`page_config.props.webviewSrc`** 下发（见 **`mfm-api`** 的 `MFM_API_H5_PUBLIC_ORIGIN`），小程序壳页只传 `page-key`。

本地 dev 时，在 **mfm-api** `.env` 设置例如：

```bash
MFM_API_H5_PUBLIC_ORIGIN=http://<局域网IP>:5180
```

并 `seed_classified_config` 后重启 API。微信开发者工具须用局域网 IP，不能用 `127.0.0.1`。

## 路由表

见 `src/config/rank-routes.ts`；与 **`page_config.json`** 中 `webviewSrc` 路径一致。
