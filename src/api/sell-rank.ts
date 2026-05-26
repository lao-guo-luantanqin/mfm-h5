import { apiGet } from "@/utils/request"
import type { SellRankData, SellRankMetric, SellRankPeriod } from "@/types/sell-rank"

export function fetchSellRank(query: {
  period?: SellRankPeriod
  metric?: SellRankMetric
  year?: number
  month?: number
  date?: string
  city?: string
}) {
  return apiGet<SellRankData>("/data/sell-rank", {
    city: query.city ?? import.meta.env.VITE_DEFAULT_CITY_ID,
    period: query.period,
    metric: query.metric,
    year: query.year,
    month: query.month,
    date: query.date,
  })
}
