import { apiGet } from "@/utils/request"
import type { HouseLadderRankData } from "@/types/house-ladder-rank"

export function fetchHouseLadderRank(query?: {
  page?: number
  size?: number
  level?: string
  district?: string
  plate?: string
}) {
  return apiGet<HouseLadderRankData>("/data/house-ladder-rank", query)
}
