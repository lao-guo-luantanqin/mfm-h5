/**
 * 路由与房小团 ``/v2/pages/…`` 对齐（南京 ``房产信息工具区/房产榜单``）。
 */
export interface RankRouteDef {
  id: string
  title: string
  /** vue-router path（含 ``/pages`` 前缀） */
  path: string
}

export const RANK_ROUTES: RankRouteDef[] = [
  { id: "hub", title: "榜单中心", path: "/pages/tools/app-list/rank" },
  { id: "sell-rank", title: "新房网签榜", path: "/pages/data/sell-rank" },
  { id: "project-rank", title: "楼盘排行榜", path: "/pages/project-list/project-rank" },
  { id: "new-house-price", title: "新房价格风云榜", path: "/pages/price/new-house" },
  { id: "house-type-popularity", title: "户型人气榜", path: "/pages/house-rank-list/index" },
  { id: "house-ladder", title: "户型天梯榜", path: "/pages/house/ladder/index" },
  { id: "house-search-rank", title: "二手房源找房榜", path: "/pages/house-list/house-search-rank" },
  { id: "aggregation-rank", title: "二手房排行榜", path: "/pages/ershou/aggregation-rank" },
  { id: "ershou-ranking", title: "热卖二手小区", path: "/pages/ershou/ranking" },
  { id: "auction-rank", title: "土拍榜单", path: "/pages/auction/auction-rank" },
]

export function rankRouteById(id: string): RankRouteDef | undefined {
  return RANK_ROUTES.find((r) => r.id === id)
}

/** 供小程序 ``web-view`` 拼 URL：``{origin}/v2/pages/tools/app-list/rank`` */
export function deployPathFromRoute(route: RankRouteDef): string {
  return route.path.replace(/^\/pages\//, "")
}
