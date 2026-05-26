/**
 * 榜单中心入口卡片 · 对齐房小团 ``pages-tools-app-list-rank``（南京 ``房产信息工具区/房产榜单``）。
 */
export interface RankHubItem {
  /** 与 ``rank-routes.ts`` 的 ``id`` 一致 */
  id: string
  title: string
  imageUrl: string
  /** 站内跳转附加 query（如热卖二手小区默认 tab） */
  query?: Record<string, string>
}

export const RANK_HUB_HEADER_BG =
  "https://imgcdn.huanjutang.com/internal/image/20250516/d0j8b26thvuik8bgngt0.png"

export const RANK_HUB_SLOGAN =
  "https://imgcdn.huanjutang.com/assets/img/2021721110258081.png"

/** 卡片顺序与南京房小团 ``dataMap.default`` 一致 */
export const RANK_HUB_ITEMS: RankHubItem[] = [
  {
    id: "project-rank",
    title: "楼盘排行榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfng.png",
  },
  {
    id: "sell-rank",
    title: "新房网签榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfo0.png",
  },
  {
    id: "new-house-price",
    title: "新房价格风云榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfmg.png",
  },
  {
    id: "house-ladder",
    title: "户型天梯榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfp0.png",
  },
  {
    id: "house-type-popularity",
    title: "户型人气榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250723/d2090bethvus68vik5r0.png",
  },
  {
    id: "house-search-rank",
    title: "二手房源找房榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250805/d28r26mthvus68vik92g.png",
  },
  {
    id: "ershou-ranking",
    title: "热卖二手小区",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfn0.png",
    query: { tabId: "apartment", subId: "trans_num" },
  },
  {
    id: "aggregation-rank",
    title: "二手房行情榜单",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfpg.png",
  },
  {
    id: "auction-rank",
    title: "土拍价格榜",
    imageUrl: "https://imgcdn.huanjutang.com/internal/image/20250515/d0iq26ethvuik8bgnfq0.png",
  },
]
