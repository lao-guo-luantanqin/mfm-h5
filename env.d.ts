/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEFAULT_CITY_ID: string
}

interface ImportMetaEnv {
  readonly env: ImportMetaEnv
}
