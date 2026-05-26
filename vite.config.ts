import { fileURLToPath, URL } from "node:url"
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"

/** 与房小团 ``fxt-mobile…/v2/pages/…`` 路径对齐，便于 web-view 换源 */
const BASE = "/v2/"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiTarget = (env.VITE_API_BASE_URL || "http://127.0.0.1:8001").replace(/\/+$/, "")

  return {
    base: BASE,
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_DEV_PORT || 5180),
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
  }
})
