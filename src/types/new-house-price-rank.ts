/** 对齐 ``GET /data/new-house-price-rank`` JSON */

export type NewHousePriceRankItem = {
  batchId?: string
  projectId?: string
  name?: string
  area?: string
  value?: number
  rank?: number
}

export type NewHousePriceRankSnapshot = {
  date?: string
  list?: NewHousePriceRankItem[]
}

export type NewHousePriceRankPlate = {
  id?: string
  areaId?: string
  name?: string
}

export type NewHousePriceRankArea = {
  area?: string
  areaid?: string
  plates?: NewHousePriceRankPlate[]
}

export type NewHousePriceRankData = {
  updateTime?: string
  data?: NewHousePriceRankSnapshot[]
  areas?: NewHousePriceRankArea[]
}
