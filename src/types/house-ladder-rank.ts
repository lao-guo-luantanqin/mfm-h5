/** 对齐 ``GET /data/house-ladder-rank`` JSON（OutBase → camelCase） */

export type HouseLadderLevel = "S" | "A" | "B" | "C"

export type HouseLadderRankItem = {
  houseTypeId?: string
  projectId?: string
  projectName?: string
  image?: string
  level?: string
  square?: string
  room?: string
  squareRatio?: number
  percent?: number
}

export type HouseLadderFilterOption = {
  title?: string
  value?: string
  isChecked?: boolean
}

export type HouseLadderFilterTab = {
  key?: string
  title?: string
  children?: HouseLadderFilterOption[]
}

export type HouseLadderDistrict = {
  district?: string
  plates?: string[]
}

export type HouseLadderRankData = {
  items?: HouseLadderRankItem[]
  hasMore?: boolean
  filters?: HouseLadderFilterTab[]
  districts?: HouseLadderDistrict[]
}
