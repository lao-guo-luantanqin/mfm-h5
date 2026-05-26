export interface ErshouRankingSubTab {
  type?: string
  title?: string
}

export interface ErshouRankingPrimaryTab {
  id?: string
  name?: string
}

export interface ErshouRankingTabsData {
  dateTips?: string
  primaryTabs?: ErshouRankingPrimaryTab[]
  subTabs?: Record<string, ErshouRankingSubTab[]>
}

export interface ErshouRankingHeaderColumn {
  key?: string
  title?: string
  tips?: string
  align?: string
  prepositionUnit?: string
  unit?: string
}

export interface ErshouRankingBizCircle {
  id?: number
  areaId?: number
  name?: string
}

export interface ErshouRankingArea {
  area?: string
  areaId?: number
  bizCircles?: ErshouRankingBizCircle[]
}

export interface ErshouRankingItem {
  rank?: number
  name?: string
  areaName?: string
  bizCircleName?: string
  apartmentNo?: string
  percent?: number
  transAvgPrice?: number
  transTotalPrice?: number
  transNum?: number
  toseeNum?: number
  priceChange?: number
  rentTransAvgPrice?: number
  rentReturnRate?: number
}

export interface ErshouRankingQuotationItem {
  title?: string
  tips?: string
  value?: number | null
  unit?: string
  color?: string
}

export interface ErshouRankingTopInfoData {
  quotationData?: ErshouRankingQuotationItem[]
}

export interface ErshouRankingData {
  items?: ErshouRankingItem[]
  header?: ErshouRankingHeaderColumn[]
  listTips?: string
  hasMore?: boolean
  areas?: ErshouRankingArea[]
}
