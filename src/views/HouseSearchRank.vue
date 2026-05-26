<template>
  <div class="house-search-rank">
    <img class="house-search-rank__header" :src="IMG.header" alt="" />

    <button type="button" class="house-search-rank__area-btn" @click="showAreaPicker = true">
      <span class="house-search-rank__area-text">{{ areaLabel }}</span>
      <img class="house-search-rank__area-icon" :src="IMG.areaArrow" alt="" />
    </button>

    <div class="house-search-rank__sticky">
      <div class="house-search-rank__blue-bg" />
      <div class="house-search-rank__tab-head" :style="{ backgroundImage: `url(${IMG.tabBg})` }">
        <div ref="tabScrollRef" class="house-search-rank__tabs">
          <div class="house-search-rank__tab-list">
            <div
              v-for="(tab, index) in tabs"
              :key="tab.type || tab.value || index"
              :id="`tab-item-${tab.type}`"
              class="house-search-rank__tab-item"
            >
              <span class="house-search-rank__tab-line" :class="{ 'house-search-rank__tab-line--first': index === 0 }" />
              <button
                type="button"
                class="house-search-rank__tab-btn"
                @click="selectTab(tab.type || tab.value || '')"
              >
                <img
                  v-if="currentTab === (tab.type || tab.value) && tab.image"
                  class="house-search-rank__tab-image"
                  :src="tab.image"
                  alt=""
                />
                <span
                  v-else
                  class="house-search-rank__tab-text"
                  :class="{ 'house-search-rank__tab-text--active': currentTab === (tab.type || tab.value) }"
                >
                  {{ tab.title }}
                </span>
              </button>
              <span v-if="index === tabs.length - 1" class="house-search-rank__tab-line" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && !list.length" class="house-search-rank__state">
      <img class="house-search-rank__loading" :src="IMG.loading" alt="" />
      <span>加载中</span>
    </div>

    <div v-else-if="list.length" class="house-search-rank__list">
      <HouseSearchRankItem
        v-for="(item, index) in list"
        :key="item.houseId ?? item.houseNo ?? item.rank ?? index"
        :item="item"
        :rank-index="index"
        @click="onItemTap"
      />
      <div v-if="loadingMore" class="house-search-rank__state house-search-rank__state--inline">
        <img class="house-search-rank__loading" :src="IMG.loading" alt="" />
        <span>加载中</span>
      </div>
    </div>

    <div v-else-if="!loading" class="house-search-rank__state">
      <img class="house-search-rank__empty-img" :src="IMG.empty" alt="" />
      <span>暂无数据</span>
    </div>

    <button type="button" class="house-search-rank__download" @click="onDownload">
      <img class="house-search-rank__download-icon" :src="IMG.download" alt="" />
      <span>下载</span>
    </button>

    <div v-if="showAreaPicker" class="house-search-rank__mask" @click="showAreaPicker = false">
      <div class="house-search-rank__picker" @click.stop>
        <div class="house-search-rank__picker-head">
          <span>选择区域</span>
          <button type="button" class="house-search-rank__picker-close" @click="showAreaPicker = false">关闭</button>
        </div>
        <div class="house-search-rank__picker-body">
          <div
            v-for="area in areas"
            :key="`${area.areaId}-${area.area}`"
            class="house-search-rank__area-block"
          >
            <button type="button" class="house-search-rank__district" @click="selectArea(area, null)">
              {{ area.area }}
            </button>
            <div v-if="area.bizCircles?.length" class="house-search-rank__circle-list">
              <button
                v-for="circle in area.bizCircles.filter((c) => c.name !== '不限')"
                :key="`${area.areaId}-${circle.id}`"
                type="button"
                class="house-search-rank__circle"
                @click="selectArea(area, circle)"
              >
                {{ circle.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from "vue"
import { useRoute } from "vue-router"
import { fetchHouseSearchRank, fetchHouseSearchRankTabs } from "@/api/house-search-rank"
import HouseSearchRankItem from "@/components/house-search-rank/HouseSearchRankItem.vue"
import { IMG, PAGE_SIZE } from "@/config/house-search-rank"
import type {
  HouseSearchRankArea,
  HouseSearchRankBizCircle,
  HouseSearchRankItem as HouseSearchRankRow,
  HouseSearchRankTab,
} from "@/types/house-search-rank"

const route = useRoute()
const tabScrollRef = ref<HTMLElement | null>(null)

const state = reactive({
  loading: false,
  loadingMore: false,
  list: [] as HouseSearchRankRow[],
  tabs: [] as HouseSearchRankTab[],
  areas: [] as HouseSearchRankArea[],
  page: 1,
  hasMore: true,
  currentTab: "",
  areaId: -1,
  bizCircleId: -1,
  areaLabel: "全城",
  showAreaPicker: false,
})

const { loading, loadingMore, list, tabs, areas, currentTab, areaLabel, showAreaPicker } = toRefs(state)

function scrollActiveTabIntoView() {
  if (!state.currentTab) return
  void nextTick(() => {
    const el = document.getElementById(`tab-item-${state.currentTab}`)
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  })
}

async function loadPage(page: number, append: boolean) {
  if (append) {
    if (!state.hasMore || state.loadingMore) return
    state.loadingMore = true
  } else {
    state.loading = true
  }
  try {
    const res = await fetchHouseSearchRank({
      page,
      size: PAGE_SIZE,
      tab: state.currentTab || undefined,
      areaId: state.areaId === -1 ? undefined : state.areaId,
      bizCircleId: state.bizCircleId === -1 ? undefined : state.bizCircleId,
    })
    const nextItems = res.items ?? []
    state.list = append ? state.list.concat(nextItems) : nextItems
    state.hasMore = Boolean(res.hasMore)
    state.page = page
    if (!append && res.areas?.length) {
      state.areas = res.areas
      syncAreaLabel()
    }
  } catch {
    if (!append) {
      state.list = []
    }
    state.hasMore = false
  } finally {
    state.loading = false
    state.loadingMore = false
  }
}

function syncAreaLabel() {
  if (state.areaId === -1) {
    state.areaLabel = "全城"
    return
  }
  const area = state.areas.find((item) => item.areaId === state.areaId)
  if (!area) return
  if (state.bizCircleId === -1) {
    state.areaLabel = area.area ?? "全城"
    return
  }
  const circle = area.bizCircles?.find((item) => item.id === state.bizCircleId)
  state.areaLabel = circle?.name ?? area.area ?? "全城"
}

function reload() {
  state.page = 1
  state.hasMore = true
  window.scrollTo({ top: 0, behavior: "smooth" })
  void loadPage(1, false)
}

function loadMore() {
  if (!state.hasMore || state.loading || state.loadingMore) return
  void loadPage(state.page + 1, true)
}

function selectTab(next: string) {
  if (!next || state.currentTab === next) return
  state.currentTab = next
  scrollActiveTabIntoView()
  reload()
}

function selectArea(area: HouseSearchRankArea, circle: HouseSearchRankBizCircle | null) {
  state.areaId = area.areaId ?? -1
  if (!circle || circle.name === "不限") {
    state.bizCircleId = -1
    state.areaLabel = area.area === "全城" ? "全城" : (area.area ?? "全城")
  } else {
    state.bizCircleId = circle.id ?? -1
    state.areaLabel = circle.name ?? area.area ?? "全城"
  }
  state.showAreaPicker = false
  reload()
}

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
    loadMore()
  }
}

function toast(title: string) {
  const uni = (window as Window & { uni?: { showToast?: (o: { title: string; icon: string }) => void } }).uni
  if (uni?.showToast) {
    uni.showToast({ title, icon: "none" })
    return
  }
  window.alert(title)
}

function onItemTap(_item: HouseSearchRankRow) {
  toast("房源详情请在小程序内打开")
}

function onDownload() {
  if (!state.list.length) {
    toast("暂无数据，不支持生成海报")
    return
  }
  toast("下载海报请在小程序内打开")
}

function applyRouteQuery() {
  const areaId = Number(route.query.areaId)
  const bizCircleId = Number(route.query.bizCircleId)
  const subId = String(route.query.subId ?? "")
  if (!Number.isNaN(areaId)) state.areaId = areaId
  if (!Number.isNaN(bizCircleId)) state.bizCircleId = bizCircleId
  if (subId) state.currentTab = subId
}

onMounted(async () => {
  document.title = "找房榜"
  applyRouteQuery()
  window.addEventListener("scroll", onScroll, { passive: true })
  state.loading = true
  try {
    const tabsRes = await fetchHouseSearchRankTabs()
    state.tabs = tabsRes.tabs ?? []
    if (!state.currentTab) {
      state.currentTab = state.tabs[0]?.type || state.tabs[0]?.value || "hot"
    }
    scrollActiveTabIntoView()
  } catch {
    state.tabs = []
    state.currentTab = state.currentTab || "hot"
  }
  await loadPage(1, false)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<style scoped>
.house-search-rank {
  --rpx: calc(100vw / 750);
  background: #fff;
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: calc(160 * var(--rpx) + env(safe-area-inset-bottom));
  position: relative;
}

.house-search-rank__header {
  display: block;
  height: calc(320 * var(--rpx));
  width: 100%;
}

.house-search-rank__area-btn {
  align-items: center;
  appearance: none;
  background: linear-gradient(180deg, #fff, #fff 40%, #bcdeff);
  border: calc(2 * var(--rpx)) solid #fff;
  border-radius: calc(24 * var(--rpx));
  box-shadow: 0 calc(4 * var(--rpx)) calc(16 * var(--rpx)) rgb(0 0 0 / 8%);
  display: inline-flex;
  height: calc(44 * var(--rpx));
  left: 50%;
  padding: 0 calc(20 * var(--rpx));
  position: absolute;
  top: calc(200 * var(--rpx));
  transform: translateX(-50%);
}

.house-search-rank__area-text {
  color: rgb(0 0 0 / 85%);
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  line-height: calc(24 * var(--rpx));
  white-space: nowrap;
}

.house-search-rank__area-icon {
  height: calc(20 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.house-search-rank__sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.house-search-rank__blue-bg {
  background: #00129c;
  height: calc(40 * var(--rpx));
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.house-search-rank__tab-head {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: calc(124 * var(--rpx));
  position: relative;
  z-index: 2;
}

.house-search-rank__tabs {
  -webkit-overflow-scrolling: touch;
  margin-top: calc(-48 * var(--rpx));
  overflow-x: auto;
  padding-top: calc(24 * var(--rpx));
  scrollbar-width: none;
  white-space: nowrap;
}

.house-search-rank__tabs::-webkit-scrollbar {
  display: none;
}

.house-search-rank__tab-list {
  align-items: center;
  display: inline-flex;
  height: calc(68 * var(--rpx));
}

.house-search-rank__tab-item {
  align-items: center;
  display: inline-flex;
}

.house-search-rank__tab-item:last-child {
  margin-right: calc(12 * var(--rpx));
}

.house-search-rank__tab-line {
  background: transparent;
  display: inline-block;
  height: calc(68 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.house-search-rank__tab-line--first {
  width: calc(32 * var(--rpx));
}

.house-search-rank__tab-btn {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
}

.house-search-rank__tab-text {
  background: #fff;
  border-radius: calc(16 * var(--rpx));
  color: rgb(0 0 0 / 85%);
  display: inline-block;
  font-size: calc(26 * var(--rpx));
  font-weight: 500;
  height: calc(68 * var(--rpx));
  line-height: calc(70 * var(--rpx));
  padding: 0 calc(24 * var(--rpx));
}

.house-search-rank__tab-text--active {
  background: #2576f3;
  color: #fff;
  font-weight: 700;
}

.house-search-rank__tab-image {
  display: block;
  height: calc(68 * var(--rpx));
  width: calc(164 * var(--rpx));
}

.house-search-rank__list {
  margin-top: calc(-24 * var(--rpx));
  padding: 0 calc(32 * var(--rpx));
}

.house-search-rank__state {
  align-items: center;
  color: rgb(0 0 0 / 45%);
  display: flex;
  flex-direction: column;
  font-size: calc(28 * var(--rpx));
  justify-content: center;
  min-height: calc(420 * var(--rpx));
}

.house-search-rank__state--inline {
  min-height: calc(120 * var(--rpx));
}

.house-search-rank__loading {
  animation: house-search-rank-spin 1.5s linear infinite;
  height: calc(40 * var(--rpx));
  margin-bottom: calc(16 * var(--rpx));
  width: calc(40 * var(--rpx));
}

.house-search-rank__empty-img {
  margin-bottom: calc(16 * var(--rpx));
  width: calc(372 * var(--rpx));
}

.house-search-rank__download {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  border-radius: calc(8 * var(--rpx));
  bottom: calc(128 * var(--rpx) + env(safe-area-inset-bottom));
  box-shadow: 0 calc(2 * var(--rpx)) calc(6 * var(--rpx)) hsl(0deg 1% 71% / 40%);
  display: flex;
  flex-direction: column;
  height: calc(84 * var(--rpx));
  justify-content: center;
  position: fixed;
  right: calc(32 * var(--rpx));
  width: calc(80 * var(--rpx));
  z-index: 10;
}

.house-search-rank__download-icon {
  height: calc(36 * var(--rpx));
  width: calc(36 * var(--rpx));
}

.house-search-rank__download span {
  color: rgb(0 0 0 / 85%);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
}

.house-search-rank__mask {
  align-items: flex-end;
  background: rgb(0 0 0 / 45%);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 20;
}

.house-search-rank__picker {
  background: #fff;
  border-radius: calc(24 * var(--rpx)) calc(24 * var(--rpx)) 0 0;
  max-height: 70vh;
  overflow: hidden;
  width: 100%;
}

.house-search-rank__picker-head {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  font-size: calc(30 * var(--rpx));
  font-weight: 700;
  justify-content: space-between;
  padding: calc(24 * var(--rpx)) calc(32 * var(--rpx));
}

.house-search-rank__picker-close {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(28 * var(--rpx));
}

.house-search-rank__picker-body {
  max-height: calc(70vh - calc(88 * var(--rpx)));
  overflow-y: auto;
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx)) calc(32 * var(--rpx));
}

.house-search-rank__area-block + .house-search-rank__area-block {
  margin-top: calc(24 * var(--rpx));
}

.house-search-rank__district {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  padding: 0;
}

.house-search-rank__circle-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(12 * var(--rpx));
  margin-top: calc(12 * var(--rpx));
}

.house-search-rank__circle {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  font-size: calc(24 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

@keyframes house-search-rank-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
