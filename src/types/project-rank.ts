export type ProjectRankTabKey =
  | "popularity"
  | "hotSearch"
  | "follow"
  | "sell"
  | "chat"
  | "luxury"

export type ProjectRankTab = {
  key?: ProjectRankTabKey | string
  label?: string
}

export type ProjectRankDistrict = {
  district?: string
  plates?: string[]
}

export type ProjectRankItem = {
  rank?: number
  _id?: string
  projectName?: string
  districtName?: string
  plateName?: string
  coverImage?: string
  priceDisplay?: string
  buildingAreaRange?: string
  viewCountText?: string
  commentCount?: number
  topLeftTag?: string
  dynamicPreview?: string
  salesRank?: string
  weightText?: string
  isHot?: boolean
  isRecommend?: boolean
  saleStatus?: string
  imageTags?: Array<{ icon?: string; text?: string }>
  tagsData?: Array<{ name?: string; color?: string; bgColor?: string; icon?: string }>
}

export type ProjectRankData = {
  tab?: ProjectRankTabKey | string
  disclaimer?: string
  updatedAt?: string
  items?: ProjectRankItem[]
  hasMore?: boolean
  tabs?: ProjectRankTab[]
  districts?: ProjectRankDistrict[]
}
