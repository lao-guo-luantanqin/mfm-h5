<template>
  <div class="auction-rank">
    <div
      class="auction-rank__header-bg"
      :style="{ backgroundImage: `url(${activeTabConfig.headerBg})` }"
    />

    <p class="auction-rank__updated">更新截止：{{ updateAt || "-" }}</p>

    <div
      class="auction-rank__sticky"
      :style="{ background: tabSticky ? '#241000' : undefined }"
    >
      <div ref="tabScrollRef" class="auction-rank__tab-scroll">
        <div class="auction-rank__tabs">
          <button
            v-for="tab in PRIMARY_TABS"
            :key="tab.id"
            type="button"
            class="auction-rank__tab"
            :class="{ 'auction-rank__tab--active': activeTab === tab.id }"
            @click="selectTab(tab.id)"
          >
            <span v-if="activeTab !== tab.id" class="auction-rank__tab-spacer" aria-hidden="true" />
            <img
              v-if="activeTab === tab.id"
              class="auction-rank__tab-image"
              :src="tab.image"
              :alt="tab.name"
            />
            <span v-else class="auction-rank__tab-text">{{ tab.name }}</span>
            <span v-if="activeTab !== tab.id" class="auction-rank__tab-spacer" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div v-if="activeTab === 1" class="auction-rank__desc-row">
        <p class="auction-rank__desc">{{ listTips }}</p>
        <button type="button" class="auction-rank__area-btn" @click="showAreaPicker = true">
          <span>{{ areaLabel }}</span>
          <img class="auction-rank__area-icon" :src="IMG.areaArrow" alt="" />
        </button>
      </div>

      <div v-else class="auction-rank__filter-row">
        <p class="auction-rank__desc">{{ listTips }}</p>
        <div class="auction-rank__filter-right">
          <button type="button" class="auction-rank__area-btn" @click="showAreaPicker = true">
            <span>{{ areaLabel }}</span>
            <img class="auction-rank__area-icon" :src="IMG.areaArrow" alt="" />
          </button>
          <button type="button" class="auction-rank__year-btn" @click="showYearPicker = true">
            <span>{{ yearLabel }}</span>
            <img class="auction-rank__area-icon" :src="IMG.areaArrow" alt="" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="auction-rank__state">
      <span>加载中</span>
    </div>

    <div v-else-if="list.length && listStyle === 'rank'" class="auction-rank__list">
      <AuctionRankFloorItem
        v-for="item in list"
        :key="`${item.rankNum}-${item.auctionId || item.areaName}`"
        :item="item"
        :unit="unit"
        @open="onOpenDetail"
      />
    </div>

    <div v-else-if="list.length && listStyle === 'deal'" class="auction-rank__list auction-rank__list--deal">
      <AuctionRankDealItem
        v-for="item in list"
        :key="`${item.rankNum}-${item.trademarkName || item.areaName || item.plateName}`"
        :item="item"
        :deal-type="dealType"
      />
    </div>

    <div v-else class="auction-rank__state">
      <span>暂无数据</span>
    </div>

    <footer class="auction-rank__footer">
      <img class="auction-rank__slogan" :src="IMG.slogan" alt="房小团" />
    </footer>

    <div class="auction-rank__float-panel">
      <button type="button" class="auction-rank__float-item" @click="onDownload">
        <img :src="IMG.download" alt="" />
        <span>下载</span>
      </button>
      <button type="button" class="auction-rank__float-item" @click="onShare">
        <img :src="IMG.share" alt="" />
        <span>分享</span>
      </button>
    </div>

    <button type="button" class="auction-rank__timeline" @click="onShareTimeline">
      <img :src="IMG.timelineShare" alt="朋友圈" />
    </button>

    <div v-if="showAreaPicker" class="auction-rank__mask" @click="showAreaPicker = false">
      <div class="auction-rank__picker" @click.stop>
        <div class="auction-rank__picker-head">
          <span>选择区域</span>
          <button type="button" @click="showAreaPicker = false">关闭</button>
        </div>
        <button
          v-for="area in areas"
          :key="area.id"
          type="button"
          class="auction-rank__picker-item"
          :class="{ 'auction-rank__picker-item--active': areaId === (area.id ?? 0) }"
          @click="onAreaSelect(area.id ?? 0, area.area || '全城')"
        >
          {{ area.area }}
        </button>
      </div>
    </div>

    <div v-if="showYearPicker" class="auction-rank__mask" @click="showYearPicker = false">
      <div class="auction-rank__picker" @click.stop>
        <div class="auction-rank__picker-head">
          <span>年份</span>
          <button type="button" @click="showYearPicker = false">关闭</button>
        </div>
        <button
          v-for="year in years"
          :key="year.value"
          type="button"
          class="auction-rank__picker-item"
          :class="{ 'auction-rank__picker-item--active': yearValue === year.value }"
          @click="onYearSelect(year.value || '')"
        >
          {{ year.label || year.value }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, toRefs } from "vue"
import { useRoute } from "vue-router"
import { fetchAuctionRank } from "@/api/auction-rank"
import AuctionRankDealItem from "@/components/auction-rank/AuctionRankDealItem.vue"
import AuctionRankFloorItem from "@/components/auction-rank/AuctionRankFloorItem.vue"
import { IMG, PRIMARY_TABS, STICKY_SCROLL_RPX } from "@/config/auction-rank"
import type { AuctionRankArea, AuctionRankItem, AuctionRankYear } from "@/types/auction-rank"

const route = useRoute()

const state = reactive({
  loading: false,
  activeTab: 1,
  list: [] as AuctionRankItem[],
  listStyle: "rank",
  unit: "元/m²",
  dealType: "number",
  updateAt: "",
  listTips: PRIMARY_TABS[0].tips as string,
  areas: [{ id: 0, area: "全城" }] as AuctionRankArea[],
  years: [] as AuctionRankYear[],
  areaId: 0,
  areaLabel: "全城",
  yearValue: "",
  showAreaPicker: false,
  showYearPicker: false,
  tabSticky: false,
})

const {
  loading,
  activeTab,
  list,
  listStyle,
  unit,
  dealType,
  updateAt,
  listTips,
  areas,
  years,
  areaId,
  areaLabel,
  yearValue,
  showAreaPicker,
  showYearPicker,
  tabSticky,
} = toRefs(state)

const activeTabConfig = computed(
  () => PRIMARY_TABS.find((tab) => tab.id === state.activeTab) || PRIMARY_TABS[0],
)
const yearLabel = computed(() => {
  const current = state.years.find((item) => item.value === state.yearValue)
  return current?.label || current?.value || "请选择"
})

async function reload(resetScroll = false) {
  state.loading = true
  if (resetScroll) {
    window.scrollTo({ top: 0 })
  }
  try {
    const res = await fetchAuctionRank({
      tab: state.activeTab,
      areaId: state.areaId || undefined,
      year: state.activeTab === 1 ? undefined : state.yearValue || undefined,
    })
    state.list = res.list ?? []
    state.listStyle = res.listStyle ?? "rank"
    state.unit = res.unit || "元/m²"
    state.dealType = res.dealType || "number"
    state.updateAt = res.updateAt ?? ""
    state.listTips = res.listTips ?? activeTabConfig.value.tips
    if (res.areas?.length) {
      state.areas = res.areas
    }
    if (res.years?.length) {
      state.years = res.years
      if (!state.yearValue || !state.years.some((item) => item.value === state.yearValue)) {
        state.yearValue = state.years[0]?.value || ""
      }
    }
  } catch {
    state.list = []
  } finally {
    state.loading = false
  }
}

async function selectTab(tabId: number) {
  if (state.activeTab === tabId) return
  state.activeTab = tabId
  state.listTips = PRIMARY_TABS.find((tab) => tab.id === tabId)?.tips || state.listTips
  await reload(true)
}

async function onAreaSelect(areaId: number, label: string) {
  state.areaId = areaId
  state.areaLabel = label
  state.showAreaPicker = false
  await reload(true)
}

async function onYearSelect(value: string) {
  state.yearValue = value
  state.showYearPicker = false
  await reload(true)
}

function onOpenDetail(auctionId?: string) {
  if (!auctionId) return
  window.open(`/v2/pages/auction/detail?id=${auctionId}`, "_blank")
}

function onDownload() {
  if (!state.list.length) {
    window.alert("暂无数据，不支持生成海报")
    return
  }
  window.alert("海报下载能力待接 mfm-api /global/poster")
}

function onShare() {
  window.alert("分享能力待接小程序 web-view 桥")
}

function onShareTimeline() {
  window.alert("朋友圈分享待接小程序 timeline 壳")
}

function onScroll() {
  const threshold = (window.innerWidth / 750) * STICKY_SCROLL_RPX
  state.tabSticky = window.scrollY > threshold
}

async function bootstrap() {
  const query = route.query
  state.activeTab = Number(query.tab || query.tabId || 1)
  state.areaId = Number(query.areaId ?? 0)
  state.yearValue = String(query.year || "")
  await reload()
}

onMounted(() => {
  document.title = "房小团-土拍榜单"
  void bootstrap()
  window.addEventListener("scroll", onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<style scoped lang="scss">
.auction-rank {
  --rpx: calc(100vw / 750);

  background: #241000;
  min-height: 100vh;
  padding-bottom: calc(240 * var(--rpx));
  position: relative;
}

.auction-rank__header-bg {
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: calc(300 * var(--rpx));
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
}

.auction-rank__updated {
  box-sizing: content-box;
  color: #ffeed2;
  font-size: calc(24 * var(--rpx));
  font-weight: 500;
  height: calc(28 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin: 0;
  padding: calc(160 * var(--rpx)) 0 calc(16 * var(--rpx));
  position: relative;
  text-align: center;
  z-index: 1;
}

.auction-rank__sticky {
  position: sticky;
  top: 0;
  z-index: 99;
}

.auction-rank__tab-scroll {
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.auction-rank__tabs {
  align-items: center;
  display: flex;
  padding: calc(24 * var(--rpx)) 0 calc(20 * var(--rpx));
  white-space: nowrap;
}

.auction-rank__tab {
  appearance: none;
  background: none;
  border: none;
  display: flex;
  font-size: 0;
  padding: 0;

  &:first-child {
    padding-left: calc(12 * var(--rpx));
  }

  &:last-child {
    padding-right: calc(12 * var(--rpx));
  }
}

.auction-rank__tab-spacer {
  display: inline-block;
  height: calc(60 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.auction-rank__tab-text {
  background: linear-gradient(180deg, #fff, rgb(255 255 255 / 90%));
  border: calc(1 * var(--rpx)) solid #fff;
  border-radius: calc(16 * var(--rpx));
  color: rgb(0 0 0 / 90%);
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  height: calc(60 * var(--rpx));
  line-height: calc(60 * var(--rpx));
  padding: 0 calc(20 * var(--rpx));
}

.auction-rank__tab-image {
  height: calc(60 * var(--rpx));
  width: auto;
}

.auction-rank__desc-row,
.auction-rank__filter-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-right: calc(32 * var(--rpx));
  position: relative;
  z-index: 9;
}

.auction-rank__filter-row {
  align-items: flex-start;
}

.auction-rank__desc {
  color: hsl(0deg 0% 100% / 65%);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin: 0 0 0 calc(32 * var(--rpx));
  max-width: calc(420 * var(--rpx));
}

.auction-rank__filter-right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: calc(40 * var(--rpx));
}

.auction-rank__area-btn,
.auction-rank__year-btn {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: #fff;
  display: inline-flex;
  font-size: calc(28 * var(--rpx));
  font-weight: 500;
  gap: calc(12 * var(--rpx));
  height: calc(40 * var(--rpx));
  line-height: calc(40 * var(--rpx));
  padding: 0;
}

.auction-rank__area-icon {
  height: calc(28 * var(--rpx));
  width: calc(28 * var(--rpx));
}

.auction-rank__list {
  margin-top: calc(32 * var(--rpx));
  position: relative;
  z-index: 1;

  &--deal {
    margin-top: calc(28 * var(--rpx));
  }
}

.auction-rank__state {
  align-items: center;
  color: hsl(0deg 0% 100% / 65%);
  display: flex;
  font-size: calc(28 * var(--rpx));
  justify-content: center;
  min-height: calc(360 * var(--rpx));
}

.auction-rank__footer {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: calc(56 * var(--rpx)) 0 calc(48 * var(--rpx));
  position: relative;
  z-index: 1;
}

.auction-rank__slogan {
  height: calc(80 * var(--rpx));
  opacity: 0.35;
  width: auto;
}

.auction-rank__float-panel {
  background: linear-gradient(137deg, #442206, #3b1c02);
  border: calc(1 * var(--rpx)) solid hsl(26deg 66% 78% / 30%);
  border-radius: calc(8 * var(--rpx));
  bottom: calc(120 * var(--rpx) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  position: fixed;
  right: calc(26 * var(--rpx));
  width: calc(80 * var(--rpx));
  z-index: 10;
}

.auction-rank__float-item {
  align-items: center;
  appearance: none;
  background: transparent;
  border: none;
  color: hsl(0deg 0% 100% / 85%);
  display: flex;
  flex-direction: column;
  font-size: calc(20 * var(--rpx));
  gap: calc(4 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  padding: calc(12 * var(--rpx)) 0;

  &:first-child {
    border-bottom: calc(1 * var(--rpx)) solid hsl(0deg 0% 100% / 10%);
    margin-bottom: calc(12 * var(--rpx));
    padding-bottom: calc(20 * var(--rpx));
  }

  img {
    height: calc(36 * var(--rpx));
    width: calc(36 * var(--rpx));
  }
}

.auction-rank__timeline {
  appearance: none;
  background: none;
  border: none;
  bottom: calc(304 * var(--rpx) + env(safe-area-inset-bottom));
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

.auction-rank__mask {
  align-items: flex-end;
  background: rgb(0 0 0 / 55%);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 100;
}

.auction-rank__picker {
  background: #fff;
  border-radius: calc(24 * var(--rpx)) calc(24 * var(--rpx)) 0 0;
  max-height: 60vh;
  overflow: auto;
  padding: calc(24 * var(--rpx));
  width: 100%;
}

.auction-rank__picker-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: calc(16 * var(--rpx));

  button {
    appearance: none;
    background: none;
    border: none;
    color: #2d8cf0;
    font-size: calc(28 * var(--rpx));
  }
}

.auction-rank__picker-item {
  appearance: none;
  background: #f7f7f7;
  border: none;
  border-radius: calc(12 * var(--rpx));
  color: rgb(0 0 0 / 85%);
  display: block;
  font-size: calc(28 * var(--rpx));
  margin-bottom: calc(12 * var(--rpx));
  padding: calc(24 * var(--rpx));
  text-align: left;
  width: 100%;

  &--active {
    background: rgb(45 140 240 / 10%);
    color: #2d8cf0;
    font-weight: 600;
  }
}
</style>
