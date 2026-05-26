import type { ErshouRankingArea } from "@/types/ershou-ranking"

export interface ErshouAggregationCollection {
  title?: string
  titleText?: string
  field?: string
  unit?: string
  color?: string
}

export interface ErshouAggregationRankItem {
  name?: string
  url?: string
  transAvgPrice?: number
  transTotalPrice?: number
  transNum?: number
  toseeNum?: number
  priceChange?: number
}

export interface ErshouAggregationRankColumn {
  type?: string
  collection?: ErshouAggregationCollection
  data?: ErshouAggregationRankItem[]
}

export interface ErshouAggregationRankData {
  rankData?: ErshouAggregationRankColumn[]
  updateDate?: string
  listTips?: string
  areas?: ErshouRankingArea[]
}
