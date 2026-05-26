import { apiGet } from "@/utils/request"
import type { ErshouAggregationRankData } from "@/types/aggregation-rank"

export function fetchErshouAggregationRank(query?: {
  tab?: string
  areaId?: number
  bizCircleId?: number
}) {
  return apiGet<ErshouAggregationRankData>("/data/ershou-aggregation-rank", query)
}
