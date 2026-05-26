const API_PREFIX = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "")

export interface ApiEnvelope<T> {
  success?: boolean
  code?: number
  msg?: string
  data?: T
}

export async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const q = new URLSearchParams()
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || String(v) === "") return
      q.set(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v))
    })
  }
  const p = path.startsWith("/") ? path : `/${path}`
  const url = `${API_PREFIX}${p}${q.toString() ? `?${q}` : ""}`
  const res = await fetch(url, { credentials: "include" })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as ApiEnvelope<T> | T
  if (json && typeof json === "object" && "data" in json && (json as ApiEnvelope<T>).data !== undefined) {
    return (json as ApiEnvelope<T>).data as T
  }
  return json as T
}
