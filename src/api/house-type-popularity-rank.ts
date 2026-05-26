import { apiGet } from "@/utils/request"
import type { HouseTypePopularityRankData } from "@/types/house-type-popularity-rank"

export function fetchHouseTypePopularityRank(query?: {
  page?: number
  size?: number
  room?: string
  district?: string
  plate?: string
}) {
  return apiGet<HouseTypePopularityRankData>("/data/house-type-popularity-rank", query)
}
