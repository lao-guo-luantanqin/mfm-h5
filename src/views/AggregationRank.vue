<template>
  <div class="aggregation-rank">
    <header class="aggregation-rank__header">
      <p v-if="updateDate" class="aggregation-rank__updated">{{ updateDate }}</p>

      <div
        class="aggregation-rank__sticky"
        :style="{ background: tabSticky ? '#3a1d07' : undefined }"
      >
        <div class="aggregation-rank__tabs">
          <button
            v-for="tab in PRIMARY_TABS"
            :key="tab.id"
            type="button"
            class="aggregation-rank__tab"
            :class="{ 'aggregation-rank__tab--active': tabId === tab.id }"
            :style="{ backgroundImage: `url(${tabId === tab.id ? IMG.tabActive : IMG.tabDefault})` }"
            @click="selectTab(tab.id)"
          >
            {{ tab.name }}
          </button>
        </div>

        <div v-if="showAreaFilter || listTips" class="aggregation-rank__filter-row">
          <button
            v-if="showAreaFilter"
            type="button"
            class="aggregation-rank__area-btn aggregation-rank__area-btn--active"
            @click="showAreaPicker = true"
          >
            <span>{{ areaLabel }}</span>
            <img class="aggregation-rank__area-icon" :src="IMG.areaArrow" alt="" />
          </button>
          <span v-else class="aggregation-rank__area-placeholder" aria-hidden="true">占位</span>
          <p v-if="listTips" class="aggregation-rank__list-tips">{{ listTips }}</p>
        </div>
      </div>
    </header>

    <div v-if="loading" class="aggregation-rank__grid">
      <div v-for="index in 4" :key="index" class="aggregation-rank__skeleton" />
    </div>

    <div v-else-if="columns.length" class="aggregation-rank__grid">
      <AggregationRankColumn
        v-for="(column, index) in columns"
        :key="`${column.type}-${index}`"
        :column="column"
        :tab="tabId"
        @open-detail="onOpenDetail"
        @open-full="onOpenFull"
      />
    </div>

    <div v-else class="aggregation-rank__state">
      <span>暂无数据</span>
    </div>

    <footer class="aggregation-rank__footer">
      <img class="aggregation-rank__slogan" :src="IMG.slogan" alt="房小团" />
    </footer>

    <div class="aggregation-rank__fixed-buttons">
      <button type="button" class="aggregation-rank__float-btn" @click="onPriceMap">
        <img :src="IMG.priceMap" alt="" />
        <span>涨跌</span>
      </button>
      <button type="button" class="aggregation-rank__float-btn" @click="onDownload">
        <img :src="IMG.download" alt="" />
        <span>下载</span>
      </button>
    </div>

    <button type="button" class="aggregation-rank__timeline" @click="onShareTimeline">
      <img :src="IMG.timelineShare" alt="朋友圈" />
    </button>

    <AggregationRankAreaPicker
      :visible="showAreaPicker"
      :mode="areaPickerMode"
      :areas="areas"
      :area-id="areaId"
      :biz-circle-id="bizCircleId"
      @close="showAreaPicker = false"
      @confirm="onAreaConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, toRefs } from "vue"
import { useRoute, useRouter } from "vue-router"
import { fetchErshouAggregationRank } from "@/api/aggregation-rank"
import AggregationRankAreaPicker from "@/components/aggregation-rank/AggregationRankAreaPicker.vue"
import AggregationRankColumn from "@/components/aggregation-rank/AggregationRankColumn.vue"
import { IMG, LIST_TIPS, PRIMARY_TABS, STICKY_SCROLL_RPX } from "@/config/aggregation-rank"
import type {
  ErshouAggregationRankColumn,
  ErshouAggregationRankItem,
} from "@/types/aggregation-rank"
import type { ErshouRankingArea } from "@/types/ershou-ranking"

const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: false,
  columns: [] as ErshouAggregationRankColumn[],
  updateDate: "",
  listTips: LIST_TIPS,
  areas: [] as ErshouRankingArea[],
  tabId: "apartment",
  areaId: -1,
  bizCircleId: -1,
  areaLabel: "全城",
  showAreaPicker: false,
  tabSticky: false,
})

const {
  loading,
  columns,
  updateDate,
  listTips,
  areas,
  tabId,
  areaId,
  bizCircleId,
  areaLabel,
  showAreaPicker,
  tabSticky,
} = toRefs(state)

const showAreaFilter = computed(() => state.tabId === "apartment" || state.tabId === "biz_circle")
const areaPickerMode = computed(() => (state.tabId === "apartment" ? "bizCircle" : "area"))

async function reload(resetScroll = false) {
  state.loading = true
  if (resetScroll) {
    window.scrollTo({ top: 0 })
  }
  try {
    const res = await fetchErshouAggregationRank({
      tab: state.tabId,
      areaId: state.areaId === -1 ? undefined : state.areaId,
      bizCircleId: state.bizCircleId === -1 ? undefined : state.bizCircleId,
    })
    state.columns = res.rankData ?? []
    state.updateDate = res.updateDate ?? ""
    state.listTips = res.listTips ?? LIST_TIPS
    if (res.areas?.length) {
      state.areas = res.areas
      syncAreaLabel()
    }
  } catch {
    state.columns = []
  } finally {
    state.loading = false
  }
}

function syncAreaLabel() {
  if (state.areaId === -1) {
    state.areaLabel = "全城"
    return
  }
  const area = state.areas.find((item) => item.areaId === state.areaId)
  if (!area) {
    state.areaLabel = "全城"
    return
  }
  if (state.bizCircleId === -1) {
    state.areaLabel = area.area || "全城"
    return
  }
  const circle = area.bizCircles?.find((item) => item.id === state.bizCircleId)
  state.areaLabel = circle?.name || area.area || "全城"
}

async function selectTab(tab: string) {
  if (state.tabId === tab) return
  state.tabId = tab
  state.areaId = -1
  state.bizCircleId = -1
  state.areaLabel = "全城"
  await reload(true)
}

async function onAreaConfirm(payload: { areaId: number; bizCircleId: number; label: string }) {
  state.areaId = payload.areaId
  state.bizCircleId = payload.bizCircleId
  state.areaLabel = payload.label
  state.showAreaPicker = false
  await reload(true)
}

function onOpenDetail(item: ErshouAggregationRankItem) {
  if (!item.url) return
  window.open(item.url, "_blank")
}

function onOpenFull(column: ErshouAggregationRankColumn) {
  const query: Record<string, string> = {
    tabId: state.tabId,
    subId: column.type || "trans_num",
  }
  if (state.areaId !== -1) query.areaId = String(state.areaId)
  if (state.bizCircleId !== -1) query.bizCircleId = String(state.bizCircleId)
  void router.push({ path: "/pages/ershou/ranking", query })
}

function onDownload() {
  if (!state.columns.length) {
    window.alert("暂无数据，不支持生成海报")
    return
  }
  window.alert("海报下载能力待接 mfm-api /global/poster")
}

function onPriceMap() {
  window.alert("涨跌地图页待接 H5 路由")
}

function onShareTimeline() {
  const query = new URLSearchParams({ tabId: state.tabId })
  window.alert(`朋友圈分享待接小程序 timeline 壳（tabId=${query.toString()}）`)
}

function onScroll() {
  const threshold = (window.innerWidth / 750) * STICKY_SCROLL_RPX
  state.tabSticky = window.scrollY > threshold
}

async function bootstrap() {
  const query = route.query
  state.tabId = String(query.tabId || query.tab || "apartment")
  state.areaId = Number(query.areaId ?? -1)
  state.bizCircleId = Number(query.bizCircleId ?? -1)
  await reload()
}

onMounted(() => {
  document.title = "房小团-二手房排行榜"
  void bootstrap()
  window.addEventListener("scroll", onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<style scoped lang="scss">
.aggregation-rank {
  --rpx: calc(100vw / 750);
  background: #3a1d07;
  min-height: 100vh;
  padding-bottom: calc(120 * var(--rpx));
}

.aggregation-rank__header {
  background: url("https://imgcdn.huanjutang.com/internal/image/20241105/46ae31710923493a104d7dfe54395db9.png")
    top / 100% calc(270 * var(--rpx)) no-repeat;
  position: relative;
  width: 100vw;
}

.aggregation-rank__updated {
  color: #ffcf97;
  font-size: calc(24 * var(--rpx));
  line-height: calc(34 * var(--rpx));
  margin: 0;
  padding: calc(120 * var(--rpx)) calc(32 * var(--rpx)) calc(22 * var(--rpx));
  text-align: center;
}

.aggregation-rank__sticky {
  padding-bottom: calc(20 * var(--rpx));
  position: sticky;
  top: 0;
  z-index: 2;
}

.aggregation-rank__tabs {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  padding: calc(22 * var(--rpx)) calc(72 * var(--rpx)) calc(30 * var(--rpx));
}

.aggregation-rank__tab {
  appearance: none;
  background: center / 100% calc(68 * var(--rpx)) no-repeat;
  border: none;
  color: #ffe2c9;
  font-size: calc(28 * var(--rpx));
  font-weight: 500;
  height: calc(68 * var(--rpx));
  line-height: calc(68 * var(--rpx));
  width: calc(186 * var(--rpx));
}

.aggregation-rank__tab--active {
  background-size: 100% calc(77 * var(--rpx));
  color: #894512;
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  height: calc(77 * var(--rpx));
  line-height: calc(77 * var(--rpx));
}

.aggregation-rank__filter-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 calc(32 * var(--rpx));
}

.aggregation-rank__area-btn {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: #ffe2c9;
  display: inline-flex;
  font-size: calc(26 * var(--rpx));
  font-weight: 500;
  gap: calc(2 * var(--rpx));
  height: calc(50 * var(--rpx));
  padding: 0 calc(22 * var(--rpx)) 0 calc(20 * var(--rpx));
}

.aggregation-rank__area-btn--active {
  border: calc(1 * var(--rpx)) solid #ffe8d2;
  border-radius: calc(34 * var(--rpx));
}

.aggregation-rank__area-icon {
  height: calc(20 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.aggregation-rank__area-placeholder {
  color: transparent;
  font-size: calc(26 * var(--rpx));
}

.aggregation-rank__list-tips {
  color: hsl(0deg 0% 100% / 45%);
  font-size: calc(22 * var(--rpx));
  line-height: calc(24 * var(--rpx));
  margin: 0;
}

.aggregation-rank__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 calc(32 * var(--rpx)) calc(120 * var(--rpx));
}

.aggregation-rank__skeleton {
  animation: aggregation-rank-pulse 1.2s ease-in-out infinite;
  background: linear-gradient(179deg, rgb(255 230 205 / 35%), rgb(255 255 255 / 18%) 25%, rgb(255 255 255 / 18%));
  border-radius: calc(24 * var(--rpx));
  height: calc(352 * var(--rpx));
  margin-bottom: calc(24 * var(--rpx));
  width: calc(330 * var(--rpx));
}

.aggregation-rank__state {
  align-items: center;
  color: hsl(0deg 0% 100% / 65%);
  display: flex;
  flex-direction: column;
  font-size: calc(28 * var(--rpx));
  justify-content: center;
  min-height: calc(360 * var(--rpx));
}

.aggregation-rank__footer {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: calc(48 * var(--rpx)) 0;
}

.aggregation-rank__slogan {
  height: calc(80 * var(--rpx));
  width: auto;
}

.aggregation-rank__fixed-buttons {
  bottom: calc(228 * var(--rpx) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: calc(16 * var(--rpx));
  position: fixed;
  right: calc(32 * var(--rpx));
  z-index: 5;
}

.aggregation-rank__float-btn {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  border-radius: calc(8 * var(--rpx));
  box-shadow: 0 calc(2 * var(--rpx)) calc(6 * var(--rpx)) hsl(0deg 1% 71% / 40%);
  display: flex;
  flex-direction: column;
  height: calc(84 * var(--rpx));
  justify-content: center;
  width: calc(80 * var(--rpx));

  img {
    height: calc(36 * var(--rpx));
    width: calc(36 * var(--rpx));
  }

  span {
    color: rgb(0 0 0 / 85%);
    font-size: calc(20 * var(--rpx));
    line-height: calc(28 * var(--rpx));
  }
}

.aggregation-rank__timeline {
  appearance: none;
  background: none;
  border: none;
  bottom: calc(120 * var(--rpx) + env(safe-area-inset-bottom));
  height: calc(80 * var(--rpx));
  padding: 0;
  position: fixed;
  right: calc(26 * var(--rpx));
  width: calc(80 * var(--rpx));
  z-index: 5;

  img {
    height: calc(80 * var(--rpx));
    width: calc(80 * var(--rpx));
  }
}

@keyframes aggregation-rank-pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 0.9;
  }
}
</style>
