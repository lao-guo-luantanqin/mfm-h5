/** 对齐 ``GET /data/house-search-rank*`` JSON */

export type HouseSearchRankTab = {
  type?: string
  title?: string
  image?: string
  value?: string
}

export type HouseSearchRankTag = {
  key?: string
  title?: string
  textColor?: string
  bgColor?: string
  tagImage?: string
}

export type HouseSearchRankCover = {
  url?: string
}

export type HouseSearchRankItem = {
  rank?: number
  houseId?: string
  houseNo?: string
  apartmentName?: string
  room?: number
  hall?: number
  areaName?: string
  bizCircle?: string
  subTitle?: string
  displayRoomNum?: string
  showTotalPrice?: string
  showUnitPrice?: string
  checkTime?: string
  saleStatus?: number
  priceChange?: number
  priceReductionLabel?: string
  cover?: HouseSearchRankCover
  tags?: HouseSearchRankTag[]
}

export type HouseSearchRankBizCircle = {
  id?: number
  areaId?: number
  name?: string
}

export type HouseSearchRankArea = {
  area?: string
  areaId?: number
  bizCircles?: HouseSearchRankBizCircle[]
}

export type HouseSearchRankTabsData = {
  tabs?: HouseSearchRankTab[]
}

export type HouseSearchRankData = {
  items?: HouseSearchRankItem[]
  hasMore?: boolean
  areas?: HouseSearchRankArea[]
}
