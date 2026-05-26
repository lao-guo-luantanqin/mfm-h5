import { apiGet } from "@/utils/request"
import type { AuctionRankData } from "@/types/auction-rank"

export function fetchAuctionRank(query?: {
  tab?: number
  areaId?: number
  year?: string
}) {
  return apiGet<AuctionRankData>("/data/auction-rank", query)
}
