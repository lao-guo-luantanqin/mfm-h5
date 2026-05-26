/** 对齐 ``GET /data/house-type-popularity-rank`` JSON */

export type HouseTypePopularityRankItem = {
  rank?: number
  houseTypeId?: string
  projectId?: string
  projectName?: string
  image?: string
  square?: string
  room?: string
  district?: string
  plate?: string
  viewCount?: number
  viewCountText?: string
  percent?: number
}

export type HouseTypePopularityFilterOption = {
  title?: string
  value?: string
  isChecked?: boolean
}

export type HouseTypePopularityFilterTab = {
  key?: string
  title?: string
  children?: HouseTypePopularityFilterOption[]
}

export type HouseTypePopularityDistrict = {
  district?: string
  plates?: string[]
}

export type HouseTypePopularityRankData = {
  disclaimer?: string
  items?: HouseTypePopularityRankItem[]
  hasMore?: boolean
  filters?: HouseTypePopularityFilterTab[]
  districts?: HouseTypePopularityDistrict[]
}
