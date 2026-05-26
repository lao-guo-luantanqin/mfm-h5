export function formatDealCount(count?: number) {
  return `${count ?? 0}套`
}

export function formatDealArea(area?: number) {
  const n = Number(area ?? 0)
  if (!Number.isFinite(n) || n <= 0) return "0㎡"
  if (n >= 10000) return `${(n / 10000).toFixed(2)}万㎡`
  return `${n >= 100 ? Math.round(n) : n.toFixed(1)}㎡`
}

export function formatDealAmount(amount?: number) {
  const n = Number(amount ?? 0)
  if (!Number.isFinite(n) || n <= 0) return "—"
  if (n >= 10000) return `${(n / 10000).toFixed(2)}亿`
  return `${Math.round(n)}万`
}

export function formatUpdatedAt(raw?: string) {
  if (!raw) return ""
  return raw.includes("更新") ? raw : `更新截止：${raw}`
}
