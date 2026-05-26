<template>
  <div class="ershou-ranking">
    <header class="ershou-ranking__header">
      <p v-if="dateTips" class="ershou-ranking__updated">{{ dateTips }}</p>
      <div class="ershou-ranking__qrcode-box">
        <img v-if="qrcodeUrl" class="ershou-ranking__qrcode" :src="qrcodeUrl" alt="" />
      </div>
    </header>

    <div class="ershou-ranking__sticky">
      <div
        class="ershou-ranking__tabs"
        :class="[`ershou-ranking__tabs--${tabId}`, { 'ershou-ranking__tabs--sticky': tabSticky }]"
        :style="{ backgroundImage: tabId ? `url(${TAB_BG[tabId]})` : undefined }"
      >
        <button
          v-for="tab in primaryTabs"
          :key="tab.id"
          type="button"
          class="ershou-ranking__tab-btn"
          :aria-label="tab.name"
          @click="selectTab(tab.id || 'apartment')"
        />
      </div>

      <div ref="subTabScrollRef" class="ershou-ranking__sub-tabs">
        <div class="ershou-ranking__sub-tab-list">
          <button
            v-for="sub in subTabs"
            :key="sub.type"
            type="button"
            :id="`sub-tab-${sub.type}`"
            class="ershou-ranking__sub-tab"
            :class="{ 'ershou-ranking__sub-tab--active': subId === sub.type }"
            @click="selectSubTab(sub.type || '')"
          >
            {{ sub.title }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showAreaFilter || listTips"
      class="ershou-ranking__filter-row"
    >
      <button
        v-if="showAreaFilter"
        type="button"
        class="ershou-ranking__area-btn"
        @click="showAreaPicker = true"
      >
        <span class="ershou-ranking__area-text">{{ areaLabel }}</span>
        <img class="ershou-ranking__area-icon" :src="IMG.areaArrow" alt="" />
      </button>
      <span v-else class="ershou-ranking__area-placeholder" aria-hidden="true">占位</span>
      <p v-if="listTips" class="ershou-ranking__list-tips">{{ listTips }}</p>
    </div>

    <div class="ershou-ranking__content">
      <ErshouRankingQuotation
        :items="quotationData"
        :sub-type="subId"
        @tip="openTipDialog"
      />

      <div class="ershou-ranking__project-list">
        <div v-if="header.length" class="ershou-ranking__table-head">
          <span class="ershou-ranking__head-spacer" aria-hidden="true" />
          <span
            v-for="(column, index) in header"
            :key="column.key || index"
            class="ershou-ranking__head-col"
            :class="{
              'ershou-ranking__head-col--name': index === 0,
              'ershou-ranking__head-col--last': index === header.length - 1,
            }"
          >
            <button
              v-if="column.tips"
              type="button"
              class="ershou-ranking__head-tip"
              @click="openTipDialog({ title: column.title, content: column.tips })"
            >
              {{ column.title }}
              <img class="ershou-ranking__head-tip-icon" :src="IMG.headerTipIcon" alt="" />
            </button>
            <template v-else>{{ column.title }}</template>
          </span>
        </div>

        <div v-if="loading && !list.length" class="ershou-ranking__state">
          <img class="ershou-ranking__loading" :src="IMG.loading" alt="" />
          <span>加载中</span>
        </div>

        <div v-else-if="list.length" class="ershou-ranking__list">
          <ErshouRankingItem
            v-for="(item, index) in list"
            :key="item.apartmentNo ?? item.name ?? item.rank ?? index"
            :item="item"
            :rank-index="index"
            :header="header"
            :tab="tabId"
            :sub-type="subId"
            @click="onItemTap"
          />
          <div v-if="loadingMore" class="ershou-ranking__state ershou-ranking__state--inline">
            <img class="ershou-ranking__loading" :src="IMG.loading" alt="" />
            <span>加载中</span>
          </div>
        </div>

        <div v-else-if="!loading" class="ershou-ranking__state ershou-ranking__state--empty">
          <img class="ershou-ranking__empty" :src="IMG.empty" alt="" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>

    <footer class="ershou-ranking__footer">
      <img class="ershou-ranking__slogan" :src="IMG.slogan" alt="房小团" />
    </footer>

    <div class="ershou-ranking__fixed-buttons">
      <button type="button" class="ershou-ranking__float-btn" @click="onPriceMap">
        <img class="ershou-ranking__float-icon" :src="IMG.priceMap" alt="" />
        <span>涨跌</span>
      </button>
      <button type="button" class="ershou-ranking__float-btn" @click="onDownload">
        <img class="ershou-ranking__float-icon" :src="IMG.downloadLegacy" alt="" />
        <span>下载</span>
      </button>
    </div>

    <div v-if="tipDialogVisible" class="ershou-ranking__mask ershou-ranking__mask--center" @click="tipDialogVisible = false">
      <div class="ershou-ranking__tip-dialog" @click.stop>
        <div class="ershou-ranking__tip-head">
          <span>{{ tipDialogTitle }}</span>
          <button type="button" class="ershou-ranking__tip-close" @click="tipDialogVisible = false">关闭</button>
        </div>
        <p class="ershou-ranking__tip-content">{{ tipDialogContent }}</p>
      </div>
    </div>

    <div v-if="showAreaPicker" class="ershou-ranking__mask ershou-ranking__mask--bottom" @click="showAreaPicker = false">
      <div class="ershou-ranking__picker" @click.stop>
        <div class="ershou-ranking__picker-head">
          <span>选择区域</span>
          <button type="button" class="ershou-ranking__picker-close" @click="showAreaPicker = false">关闭</button>
        </div>
        <div class="ershou-ranking__picker-body">
          <div
            v-for="area in areas"
            :key="`${area.areaId}-${area.area}`"
            class="ershou-ranking__area-block"
          >
            <button type="button" class="ershou-ranking__district" @click="selectArea(area, null)">
              {{ area.area }}
            </button>
            <div v-if="area.bizCircles?.length" class="ershou-ranking__circle-list">
              <button
                v-for="circle in area.bizCircles.filter((c) => c.name !== '不限')"
                :key="`${area.areaId}-${circle.id}`"
                type="button"
                class="ershou-ranking__circle"
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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from "vue"
import { useRoute } from "vue-router"
import { fetchErshouRanking, fetchErshouRankingTabs, fetchErshouRankingTopInfo } from "@/api/ershou-ranking"
import ErshouRankingItem from "@/components/ershou-ranking/ErshouRankingItem.vue"
import ErshouRankingQuotation from "@/components/ershou-ranking/ErshouRankingQuotation.vue"
import { IMG, PAGE_SIZE, TAB_BG } from "@/config/ershou-ranking"
import type {
  ErshouRankingArea,
  ErshouRankingBizCircle,
  ErshouRankingHeaderColumn,
  ErshouRankingItem as ErshouRankingRow,
  ErshouRankingPrimaryTab,
  ErshouRankingQuotationItem,
  ErshouRankingSubTab,
} from "@/types/ershou-ranking"

const route = useRoute()
const subTabScrollRef = ref<HTMLElement | null>(null)

const state = reactive({
  loading: false,
  loadingMore: false,
  list: [] as ErshouRankingRow[],
  header: [] as ErshouRankingHeaderColumn[],
  quotationData: [] as ErshouRankingQuotationItem[],
  listTips: "",
  dateTips: "",
  qrcodeUrl: "",
  primaryTabs: [] as ErshouRankingPrimaryTab[],
  subTabMap: {} as Record<string, ErshouRankingSubTab[]>,
  areas: [] as ErshouRankingArea[],
  page: 1,
  hasMore: true,
  tabId: "apartment",
  subId: "trans_num",
  areaId: -1,
  bizCircleId: -1,
  areaLabel: "全城",
  showAreaPicker: false,
  tabSticky: false,
  tipDialogVisible: false,
  tipDialogTitle: "",
  tipDialogContent: "",
})

const {
  loading,
  loadingMore,
  list,
  header,
  quotationData,
  listTips,
  dateTips,
  qrcodeUrl,
  primaryTabs,
  areas,
  tabId,
  subId,
  areaLabel,
  showAreaPicker,
  tabSticky,
  tipDialogVisible,
  tipDialogTitle,
  tipDialogContent,
} = toRefs(state)

const subTabs = computed(() => state.subTabMap[state.tabId] ?? [])
const showAreaFilter = computed(() => state.tabId === "apartment" || state.tabId === "biz_circle")

function scrollActiveSubTabIntoView() {
  if (!state.subId) return
  void nextTick(() => {
    const el = document.getElementById(`sub-tab-${state.subId}`)
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  })
}

async function loadTopInfo() {
  try {
    const res = await fetchErshouRankingTopInfo({
      tab: state.tabId,
      type: state.subId,
      areaId: state.areaId === -1 ? undefined : state.areaId,
      bizCircleId: state.bizCircleId === -1 ? undefined : state.bizCircleId,
    })
    state.quotationData = res.quotationData ?? []
  } catch {
    state.quotationData = []
  }
}

async function loadPage(page: number, append: boolean) {
  if (append) {
    if (!state.hasMore || state.loadingMore) return
    state.loadingMore = true
  } else {
    state.loading = true
  }
  try {
    const res = await fetchErshouRanking({
      page,
      size: PAGE_SIZE,
      tab: state.tabId,
      type: state.subId,
      areaId: state.areaId === -1 ? undefined : state.areaId,
      bizCircleId: state.bizCircleId === -1 ? undefined : state.bizCircleId,
    })
    const nextItems = res.items ?? []
    state.list = append ? state.list.concat(nextItems) : nextItems
    state.hasMore = Boolean(res.hasMore)
    state.page = page
    if (!append) {
      state.header = res.header ?? []
      state.listTips = res.listTips ?? ""
      if (res.areas?.length) {
        state.areas = res.areas
        syncAreaLabel()
      }
    }
  } catch {
    if (!append) {
      state.list = []
      state.header = []
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

async function reload() {
  state.page = 1
  state.hasMore = true
  await Promise.all([loadTopInfo(), loadPage(1, false)])
}

async function selectTab(tab: string) {
  if (state.tabId === tab) return
  state.tabId = tab
  const first = state.subTabMap[tab]?.[0]?.type
  state.subId = first || "trans_num"
  state.areaId = -1
  state.bizCircleId = -1
  state.areaLabel = "全城"
  scrollActiveSubTabIntoView()
  await reload()
}

async function selectSubTab(type: string) {
  if (!type || state.subId === type) return
  state.subId = type
  scrollActiveSubTabIntoView()
  await reload()
}

async function selectArea(area: ErshouRankingArea, circle: ErshouRankingBizCircle | null) {
  state.areaId = area.areaId ?? -1
  state.bizCircleId = circle?.id ?? -1
  syncAreaLabel()
  state.showAreaPicker = false
  await reload()
}

function onItemTap(item: ErshouRankingRow) {
  if (!item.apartmentNo) return
  window.open(`/v2/pages/apartment/detail?apartment_no=${item.apartmentNo}`, "_blank")
}

function onDownload() {
  window.alert("下载功能开发中")
}

function onPriceMap() {
  window.alert("涨跌地图开发中")
}

function openTipDialog(payload: { title?: string; content?: string }) {
  if (!payload.content) return
  state.tipDialogTitle = payload.title || "说明"
  state.tipDialogContent = payload.content
  state.tipDialogVisible = true
}

function onScroll() {
  state.tabSticky = window.scrollY > 40
  if (state.loadingMore || state.loading || !state.hasMore) return
  const threshold = document.documentElement.scrollHeight - window.innerHeight - 120
  if (window.scrollY >= threshold) {
    void loadPage(state.page + 1, true)
  }
}

async function bootstrap() {
  const query = route.query
  state.tabId = String(query.tabId || query.tab || "apartment")
  state.subId = String(query.subId || query.type || "")
  state.areaId = Number(query.areaId ?? -1)
  state.bizCircleId = Number(query.bizCircleId ?? -1)

  try {
    const tabs = await fetchErshouRankingTabs()
    state.dateTips = tabs.dateTips ?? ""
    state.primaryTabs = tabs.primaryTabs ?? []
    state.subTabMap = tabs.subTabs ?? {}
    if (!state.subId) {
      state.subId = state.subTabMap[state.tabId]?.[0]?.type || "trans_num"
    }
  } catch {
    state.primaryTabs = [
      { id: "apartment", name: "小区榜单" },
      { id: "biz_circle", name: "商圈榜单" },
      { id: "area", name: "区域榜单" },
    ]
  }

  scrollActiveSubTabIntoView()
  await reload()
}

onMounted(() => {
  void bootstrap()
  window.addEventListener("scroll", onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<style scoped lang="scss">
.ershou-ranking {
  --rpx: calc(100vw / 750);
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: calc(120 * var(--rpx));
}

.ershou-ranking__header {
  background: url("https://imgcdn.huanjutang.com/internal/image/20240830/d690b3fe2564b7d0991f1601edfe1410.png")
    center / 100% 100% no-repeat;
  height: calc(220 * var(--rpx));
  position: sticky;
  top: calc(-186 * var(--rpx));
  width: 100%;
  z-index: 95;
}

.ershou-ranking__updated {
  color: rgb(255 223 151 / 85%);
  font-size: calc(24 * var(--rpx));
  left: calc(34 * var(--rpx));
  line-height: calc(34 * var(--rpx));
  margin: 0;
  position: absolute;
  top: calc(113 * var(--rpx));
}

.ershou-ranking__qrcode-box {
  background: url("https://imgcdn.huanjutang.com/internal/image/20240627/28516a7c1f4c1f2bad3358911da82631.png")
    center / 100% 100% no-repeat;
  height: calc(116 * var(--rpx));
  position: absolute;
  right: 0;
  top: calc(14 * var(--rpx));
  width: calc(148 * var(--rpx));
}

.ershou-ranking__qrcode {
  border-radius: calc(96 * var(--rpx));
  height: calc(96 * var(--rpx));
  left: calc(10 * var(--rpx));
  position: absolute;
  top: calc(10 * var(--rpx));
  width: calc(96 * var(--rpx));
}

.ershou-ranking__sticky {
  position: sticky;
  top: 0;
  z-index: 98;
}

.ershou-ranking__tabs {
  background: center / 100% 100% no-repeat;
  display: flex;
  gap: calc(2 * var(--rpx));
  height: calc(108 * var(--rpx));
  margin-top: calc(-34 * var(--rpx));
  width: 100%;
}

.ershou-ranking__tabs--sticky {
  background-color: #3a1d08 !important;
}

.ershou-ranking__tab-btn {
  appearance: none;
  background: transparent;
  border: none;
  flex: 1;
  height: 100%;
}

.ershou-ranking__sub-tabs {
  background: #fff;
  overflow-x: auto;
  scrollbar-width: none;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ershou-ranking__sub-tab-list {
  display: flex;
  gap: calc(20 * var(--rpx));
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx)) calc(12 * var(--rpx));
  width: max-content;
}

.ershou-ranking__sub-tab {
  appearance: none;
  background: #f7f7f7;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: rgb(0 0 0 / 65%);
  flex: none;
  font-size: calc(24 * var(--rpx));
  height: calc(60 * var(--rpx));
  line-height: calc(60 * var(--rpx));
  padding: 0 calc(24 * var(--rpx));
}

.ershou-ranking__sub-tab--active {
  background: linear-gradient(131deg, #ffdaaa, #ffddc2);
  color: #894512;
  font-weight: 700;
}

.ershou-ranking__filter-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: calc(12 * var(--rpx));
  padding: 0 calc(32 * var(--rpx));
}

.ershou-ranking__area-btn {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  display: inline-flex;
  padding: 0;
}

.ershou-ranking__area-text {
  color: #000;
  font-size: calc(24 * var(--rpx));
  line-height: calc(32 * var(--rpx));
}

.ershou-ranking__area-icon {
  height: calc(20 * var(--rpx));
  margin-left: calc(6 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.ershou-ranking__area-placeholder {
  color: transparent;
  font-size: calc(24 * var(--rpx));
}

.ershou-ranking__list-tips {
  color: rgb(0 0 0 / 45%);
  font-size: calc(22 * var(--rpx));
  line-height: calc(24 * var(--rpx));
  margin: 0;
}

.ershou-ranking__content {
  position: relative;
}

.ershou-ranking__project-list {
  background: #f7f7f7;
  min-height: calc(100vh - calc(244 * var(--rpx)));
  overflow: hidden;
  position: relative;
  width: 100vw;
}

.ershou-ranking__table-head {
  align-items: center;
  background: #fff;
  color: rgb(0 0 0 / 45%);
  display: flex;
  font-size: calc(22 * var(--rpx));
  padding: calc(16 * var(--rpx)) calc(8 * var(--rpx)) calc(12 * var(--rpx));
}

.ershou-ranking__head-spacer {
  flex-shrink: 0;
  width: calc(72 * var(--rpx));
}

.ershou-ranking__head-col {
  flex-shrink: 0;
  width: calc(200 * var(--rpx));
}

.ershou-ranking__head-col--name {
  width: calc(200 * var(--rpx));
}

.ershou-ranking__head-col--last {
  flex: 1;
  text-align: center;
}

.ershou-ranking__head-tip {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: inherit;
  display: inline-flex;
  font: inherit;
  gap: calc(4 * var(--rpx));
  padding: 0;
}

.ershou-ranking__head-tip-icon {
  height: calc(24 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.ershou-ranking__list {
  padding: 0 calc(8 * var(--rpx));
}

.ershou-ranking__state {
  align-items: center;
  color: rgb(0 0 0 / 45%);
  display: flex;
  flex-direction: column;
  font-size: calc(28 * var(--rpx));
  justify-content: center;
  min-height: calc(360 * var(--rpx));
}

.ershou-ranking__state--inline {
  min-height: calc(120 * var(--rpx));
}

.ershou-ranking__state--empty {
  background: #fff;
  padding: calc(180 * var(--rpx)) 0 calc(274 * var(--rpx));
}

.ershou-ranking__loading {
  animation: ershou-ranking-spin 1.5s linear infinite;
  height: calc(40 * var(--rpx));
  margin-bottom: calc(16 * var(--rpx));
  width: calc(40 * var(--rpx));
}

.ershou-ranking__empty {
  margin-bottom: calc(16 * var(--rpx));
  width: calc(320 * var(--rpx));
}

.ershou-ranking__footer {
  align-items: center;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  padding: calc(48 * var(--rpx)) 0;
}

.ershou-ranking__slogan {
  height: calc(80 * var(--rpx));
  width: auto;
}

.ershou-ranking__fixed-buttons {
  bottom: calc(348 * var(--rpx) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: calc(16 * var(--rpx));
  position: fixed;
  right: calc(32 * var(--rpx));
  z-index: 5;
}

.ershou-ranking__float-btn {
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
}

.ershou-ranking__float-icon {
  height: calc(36 * var(--rpx));
  width: calc(36 * var(--rpx));
}

.ershou-ranking__float-btn span {
  color: rgb(0 0 0 / 85%);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
}

.ershou-ranking__tip-dialog {
  background: #fff;
  border-radius: calc(8 * var(--rpx));
  margin: auto calc(32 * var(--rpx));
  max-width: calc(560 * var(--rpx));
  padding: calc(48 * var(--rpx));
  width: 100%;
}

.ershou-ranking__tip-head {
  align-items: center;
  display: flex;
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  justify-content: space-between;
}

.ershou-ranking__tip-close {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(28 * var(--rpx));
}

.ershou-ranking__tip-content {
  color: rgb(0 0 0 / 65%);
  font-size: calc(28 * var(--rpx));
  line-height: calc(44 * var(--rpx));
  margin: calc(16 * var(--rpx)) 0 0;
  text-align: justify;
}

.ershou-ranking__mask {
  background: rgb(0 0 0 / 45%);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 20;
}

.ershou-ranking__mask--center {
  align-items: center;
}

.ershou-ranking__mask--bottom {
  align-items: flex-end;
}

.ershou-ranking__picker {
  background: #fff;
  border-radius: calc(24 * var(--rpx)) calc(24 * var(--rpx)) 0 0;
  max-height: 70vh;
  overflow: hidden;
  width: 100%;
}

.ershou-ranking__picker-head {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  font-size: calc(30 * var(--rpx));
  font-weight: 700;
  justify-content: space-between;
  padding: calc(24 * var(--rpx)) calc(32 * var(--rpx));
}

.ershou-ranking__picker-close {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(28 * var(--rpx));
}

.ershou-ranking__picker-body {
  max-height: calc(70vh - calc(88 * var(--rpx)));
  overflow-y: auto;
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx)) calc(32 * var(--rpx));
}

.ershou-ranking__area-block + .ershou-ranking__area-block {
  margin-top: calc(24 * var(--rpx));
}

.ershou-ranking__district {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  padding: 0;
}

.ershou-ranking__circle-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(12 * var(--rpx));
  margin-top: calc(12 * var(--rpx));
}

.ershou-ranking__circle {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  font-size: calc(24 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

@keyframes ershou-ranking-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
