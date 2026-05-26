/** 对齐 ``GET /data/sell-rank`` JSON */

export type SellRankRow = {
  _id?: string
  rank?: number
  projectName?: string
  districtName?: string
  plateName?: string
  avgPriceDisplay?: string
  totalPriceDisplay?: string
  dealCount?: number
  dealArea?: number
  dealAmount?: number
}

export type SellRankMetric = "count" | "area" | "amount"
export type SellRankPeriod = "day" | "week" | "month"

export type SellRankData = {
  period?: SellRankPeriod
  date?: string
  year?: number
  month?: number
  metric?: SellRankMetric
  district?: string
  cityName?: string
  updatedAt?: string
  rows?: SellRankRow[]
  pageNo?: number
  pageSize?: number
  total?: number
  totalPages?: number
  disclaimer?: string
}
