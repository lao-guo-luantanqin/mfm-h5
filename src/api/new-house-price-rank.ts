import { apiGet } from "@/utils/request"
import type { NewHousePriceRankData } from "@/types/new-house-price-rank"

export function fetchNewHousePriceRank(query?: { district?: string; plate?: string }) {
  return apiGet<NewHousePriceRankData>("/data/new-house-price-rank", query)
}
