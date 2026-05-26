import { createRouter, createWebHistory } from "vue-router"
import { RANK_ROUTES } from "@/config/rank-routes"

const routeComponents: Record<string, () => Promise<unknown>> = {
  hub: () => import("@/views/RankHub.vue"),
  "sell-rank": () => import("@/views/SellRank.vue"),
  "project-rank": () => import("@/views/ProjectRank.vue"),
  "new-house-price": () => import("@/views/NewHousePrice.vue"),
  "house-type-popularity": () => import("@/views/HouseTypePopularity.vue"),
  "house-ladder": () => import("@/views/HouseLadder.vue"),
  "house-search-rank": () => import("@/views/HouseSearchRank.vue"),
  "aggregation-rank": () => import("@/views/AggregationRank.vue"),
  "ershou-ranking": () => import("@/views/ErshouRanking.vue"),
  "auction-rank": () => import("@/views/AuctionRank.vue"),
}

const routes = RANK_ROUTES.map((r) => ({
  path: r.path,
  name: r.id,
  component: routeComponents[r.id],
  meta: { title: r.title },
}))

const router = createRouter({
  history: createWebHistory("/v2/"),
  routes,
})

export default router
