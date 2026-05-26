import { apiGet } from "@/utils/request"
import type { ErshouRankingData, ErshouRankingTabsData, ErshouRankingTopInfoData } from "@/types/ershou-ranking"

export function fetchErshouRankingTabs() {
  return apiGet<ErshouRankingTabsData>("/data/ershou-ranking/tabs")
}

export function fetchErshouRankingTopInfo(query?: {
  tab?: string
  type?: string
  areaId?: number
  bizCircleId?: number
}) {
  return apiGet<ErshouRankingTopInfoData>("/data/ershou-ranking/top-info", query)
}

export function fetchErshouRanking(query?: {
  page?: number
  size?: number
  tab?: string
  type?: string
  areaId?: number
  bizCircleId?: number
}) {
  return apiGet<ErshouRankingData>("/data/ershou-ranking", query)
}
