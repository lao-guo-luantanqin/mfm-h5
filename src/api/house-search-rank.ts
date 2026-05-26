import { apiGet } from "@/utils/request"
import type { HouseSearchRankData, HouseSearchRankTabsData } from "@/types/house-search-rank"

export function fetchHouseSearchRankTabs() {
  return apiGet<HouseSearchRankTabsData>("/data/house-search-rank/tabs")
}

export function fetchHouseSearchRank(query?: {
  page?: number
  size?: number
  tab?: string
  areaId?: number
  bizCircleId?: number
}) {
  return apiGet<HouseSearchRankData>("/data/house-search-rank", query)
}
