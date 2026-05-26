export interface AuctionRankArea {
  id?: number
  area?: string
}

export interface AuctionRankYear {
  value?: string
  label?: string
}

export interface AuctionRankItem {
  rankNum?: number
  areaName?: string
  biddingResult?: string
  netLandSquare?: string
  fixtureDate?: string
  transactionFloorPrice?: number
  premiumRate?: number
  trademarkName?: string
  plateName?: string
  soilNum?: number
  number?: number
  soilPrice?: number
  auctionId?: string
}

export interface AuctionRankData {
  tab?: number
  listStyle?: string
  unit?: string
  dealType?: string
  updateAt?: string
  listTips?: string
  list?: AuctionRankItem[]
  areas?: AuctionRankArea[]
  years?: AuctionRankYear[]
}
