export type SellRankRow = {
  _id: string
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
  updatedAt?: string
  rows?: SellRankRow[]
  disclaimer?: string
}
