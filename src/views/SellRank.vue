<template>
  <div class="sell-rank">
    <div class="sell-rank__sticky">
      <header class="sell-rank__header" :style="{ backgroundImage: `url(${IMG.headerBg})` }">
        <div class="sell-rank__share-wrap">
          <button type="button" class="sell-rank__share" @click="onShare">
            <img class="sell-rank__share-icon" :src="IMG.share" alt="" />
            <span class="sell-rank__share-text">分享</span>
          </button>
        </div>

        <button type="button" class="sell-rank__area" @click="onDistrictTap">
          <span class="sell-rank__area-text">{{ districtLabel }}</span>
          <img class="sell-rank__area-arrow" :src="IMG.areaArrow" alt="" />
        </button>

        <p v-if="updatedAtText && hasList" class="sell-rank__updated">{{ updatedAtText }}</p>
      </header>

      <div class="sell-rank__tabs" :style="{ backgroundImage: `url(${activeMetric.tabBg})` }">
        <button
          v-for="(item, index) in METRIC_ITEMS"
          :key="item.key"
          type="button"
          class="sell-rank__tab-item"
          :aria-label="item.label"
          @click="selectMetric(index)"
        />
      </div>

      <SellRankListHead
        v-if="hasList"
        :header-class="activeMetric.headerClass"
        :metric-label="activeMetric.label"
      />
    </div>

    <div class="sell-rank__main">
      <div v-if="hasList && summaryItems.length" class="sell-rank__quotation">
        <div
          v-for="(item, index) in summaryItems"
          :key="item.label"
          class="sell-rank__quotation-item"
        >
          <span v-if="index > 0" class="sell-rank__quotation-line" aria-hidden="true" />
          <span class="sell-rank__quotation-title">
            {{ item.label }}
            <img class="sell-rank__quotation-tip" :src="IMG.tipIcon" alt="" />
          </span>
          <span class="sell-rank__quotation-value">
            <span class="sell-rank__quotation-num">{{ item.value }}</span>
            <span v-if="item.unit" class="sell-rank__quotation-unit">{{ item.unit }}</span>
          </span>
        </div>
      </div>

      <div class="sell-rank__project-list">
        <div v-if="loading" class="sell-rank__loading">
          <span class="sell-rank__spinner" aria-hidden="true" />
          <span class="sell-rank__loading-text">加载中</span>
        </div>

        <div v-else-if="!rows.length" class="sell-rank__no-data">
          <div class="sell-rank__nodata">
            <img class="sell-rank__nodata-image" :src="IMG.empty" alt="" />
            <span class="sell-rank__nodata-text">暂无数据</span>
          </div>
        </div>

        <template v-else>
          <div class="sell-rank__rank-list">
            <SellRankListItem
              v-for="row in rows"
              :key="row._id ?? row.rank"
              :row="row"
              :metric="metric"
              :body-class="activeMetric.bodyClass"
              :max-metric-value="maxMetricValue"
              @project-tap="onProjectTap"
            />
          </div>
          <div
            class="sell-rank__water-image"
            :style="{ backgroundImage: `url(${IMG.waterBg})` }"
            aria-hidden="true"
          />
        </template>
      </div>

      <div class="sell-rank__slogan-wrap">
        <img class="sell-rank__slogan" :src="IMG.slogan" alt="房小团" />
      </div>
    </div>

    <div
      v-if="hasList"
      class="sell-rank__water-remark"
      :style="{ backgroundImage: `url(${IMG.waterRemark})` }"
      aria-hidden="true"
    />

    <footer v-if="hasList" class="sell-rank__bottom">
      <SellRankDatePicker
        :loading="loading"
        :period-label="periodLabel"
        period-active
        :range-label="rangeLabel"
        :prev-label="prevLabel"
        :next-label="nextLabel"
        :next-disabled="nextDisabled"
        @toggle-period="cyclePeriod"
        @prev="onPrev"
        @next="onNext"
      />
    </footer>

    <div class="sell-rank__floats">
      <button type="button" class="sell-rank__float-btn" @click="onDownload">
        <img class="sell-rank__float-icon" :src="IMG.download" alt="" />
        <span class="sell-rank__float-text">下载</span>
      </button>
    </div>

    <p v-if="disclaimer && hasList" class="sell-rank__disclaimer">{{ disclaimer }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, toRefs, watch } from "vue"
import { useRoute } from "vue-router"
import { fetchSellRank } from "@/api/sell-rank"
import SellRankDatePicker from "@/components/sell-rank/SellRankDatePicker.vue"
import SellRankListHead from "@/components/sell-rank/SellRankListHead.vue"
import SellRankListItem from "@/components/sell-rank/SellRankListItem.vue"
import { IMG, METRIC_ITEMS, PERIOD_ITEMS } from "@/config/sell-rank"
import type { SellRankMetric, SellRankPeriod, SellRankRow } from "@/types/sell-rank"
import { formatDealAmount, formatDealArea, formatUpdatedAt } from "@/utils/sell-rank-format"

const METRICS: SellRankMetric[] = ["count", "area", "amount"]
const PERIODS: SellRankPeriod[] = ["month", "week", "day"]

function formatIso(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const route = useRoute()

const state = reactive({
  loading: false,
  period: "month" as SellRankPeriod,
  metricIndex: 0,
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth() + 1,
  currentDate: formatIso(new Date()),
  districtLabel: "全城",
  rows: [] as SellRankRow[],
  updatedAt: "",
  disclaimer: "",
})

const { loading, metricIndex, districtLabel, rows, updatedAt, disclaimer } = toRefs(state)

const metric = computed(() => METRICS[metricIndex.value] ?? "count")

const activeMetric = computed(() => METRIC_ITEMS[metricIndex.value] ?? METRIC_ITEMS[0])

const hasList = computed(() => !loading.value && rows.value.length > 0)

const updatedAtText = computed(() => formatUpdatedAt(updatedAt.value))

const periodLabel = computed(() => PERIOD_ITEMS.find((item) => item.key === state.period)?.label ?? "月度数据")

const rangeLabel = computed(() => {
  if (state.period === "day") {
    const [y, m, d] = state.currentDate.split("-")
    return `${y}年${Number(m)}月${Number(d)}日`
  }
  if (state.period === "week") return weekRangeLabel(state.currentDate)
  return `${state.viewYear}年${String(state.viewMonth).padStart(2, "0")}月`
})

const prevLabel = computed(() => {
  if (state.period === "day") return "上一天"
  if (state.period === "week") return "上一周"
  return "上个月"
})

const nextLabel = computed(() => {
  if (state.period === "day") return "下一天"
  if (state.period === "week") return "下一周"
  return "下个月"
})

const nextDisabled = computed(() => {
  const next = new Date(state.currentDate.replace(/-/g, "/"))
  if (state.period === "month") {
    next.setMonth(next.getMonth() + 1, 1)
  } else if (state.period === "week") {
    next.setDate(next.getDate() + 7)
  } else {
    next.setDate(next.getDate() + 1)
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (state.period === "month") {
    return state.viewYear > today.getFullYear() || (state.viewYear === today.getFullYear() && state.viewMonth >= today.getMonth() + 1)
  }
  next.setHours(0, 0, 0, 0)
  return next > today
})

const maxMetricValue = computed(() => {
  const values = rows.value.map((row) => {
    if (metric.value === "area") return Number(row.dealArea ?? 0)
    if (metric.value === "amount") return Number(row.dealAmount ?? 0)
    return Number(row.dealCount ?? 0)
  })
  return values.length ? Math.max(...values) : 0
})

const summaryItems = computed(() => {
  if (!rows.value.length) return []
  const totalCount = rows.value.reduce((sum, row) => sum + Number(row.dealCount ?? 0), 0)
  const totalArea = rows.value.reduce((sum, row) => sum + Number(row.dealArea ?? 0), 0)
  const totalAmount = rows.value.reduce((sum, row) => sum + Number(row.dealAmount ?? 0), 0)
  const areaFormatted = formatDealArea(totalArea)
  const amountFormatted = formatDealAmount(totalAmount)
  return [
    { label: "网签套数", value: String(totalCount), unit: "套" },
    {
      label: "网签面积",
      value: areaFormatted.replace(/(万)?㎡$/, ""),
      unit: areaFormatted.includes("万") ? "万㎡" : "㎡",
    },
    {
      label: "网签总额",
      value: amountFormatted === "—" ? "0" : amountFormatted.replace(/(万|亿)$/, ""),
      unit: amountFormatted.includes("亿") ? "亿" : amountFormatted === "—" ? "" : "万",
    },
  ]
})

function weekRangeLabel(dateStr: string) {
  const anchor = new Date(dateStr.replace(/-/g, "/"))
  const mondayOffset = anchor.getDay() === 0 ? -6 : 1 - anchor.getDay()
  const monday = new Date(anchor)
  monday.setDate(anchor.getDate() + mondayOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const y = monday.getFullYear()
  const m1 = monday.getMonth() + 1
  const d1 = monday.getDate()
  const m2 = sunday.getMonth() + 1
  const d2 = sunday.getDate()
  if (m1 === m2) return `${y}年${m1}月${d1}-${d2}日`
  return `${y}年${m1}月${d1}-${m2}月${d2}日`
}

function shiftMonth(delta: number) {
  let y = state.viewYear
  let m = state.viewMonth + delta
  if (m < 1) {
    m = 12
    y -= 1
  } else if (m > 12) {
    m = 1
    y += 1
  }
  state.viewYear = y
  state.viewMonth = m
}

function shiftDate(deltaDays: number) {
  const next = new Date(state.currentDate.replace(/-/g, "/"))
  next.setDate(next.getDate() + deltaDays)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (next > today) return
  state.currentDate = formatIso(next)
  state.viewYear = next.getFullYear()
  state.viewMonth = next.getMonth() + 1
}

function onPrev() {
  if (state.period === "month") shiftMonth(-1)
  else if (state.period === "day") shiftDate(-1)
  else shiftDate(-7)
}

function onNext() {
  if (nextDisabled.value) return
  if (state.period === "month") shiftMonth(1)
  else if (state.period === "day") shiftDate(1)
  else shiftDate(7)
}

function cyclePeriod() {
  const idx = PERIODS.indexOf(state.period)
  state.period = PERIODS[(idx + 1) % PERIODS.length]
  state.currentDate = formatIso(new Date())
  state.viewYear = new Date().getFullYear()
  state.viewMonth = new Date().getMonth() + 1
}

function selectMetric(index: number) {
  state.metricIndex = index
}

async function loadRank() {
  state.loading = true
  try {
    const res = await fetchSellRank({
      period: state.period,
      metric: METRICS[state.metricIndex],
      year: state.period === "month" ? state.viewYear : undefined,
      month: state.period === "month" ? state.viewMonth : undefined,
      date: state.period !== "month" ? state.currentDate : undefined,
    })
    state.rows = res.rows ?? []
    state.updatedAt = res.updatedAt ?? ""
    state.disclaimer = res.disclaimer ?? ""
    if (res.year) state.viewYear = res.year
    if (res.month) state.viewMonth = res.month
    if (res.date) state.currentDate = res.date
    if (res.period) state.period = res.period
    if (res.metric) {
      const idx = METRICS.indexOf(res.metric)
      if (idx >= 0) state.metricIndex = idx
    }
  } finally {
    state.loading = false
  }
}

const q = route.query
if (q.period === "day" || q.period === "week" || q.period === "month") {
  state.period = q.period
}
if (typeof q.date === "string" && q.date) state.currentDate = q.date
if (q.year) state.viewYear = Number(q.year)
if (q.month) state.viewMonth = Number(q.month)
if (q.metric === "area") state.metricIndex = 1
else if (q.metric === "amount") state.metricIndex = 2

watch(
  () => [state.period, state.metricIndex, state.viewYear, state.viewMonth, state.currentDate] as const,
  () => {
    void loadRank()
  },
  { immediate: true },
)

onMounted(() => {
  document.title = "新房网签排行榜"
})

function toast(title: string) {
  const uni = (window as Window & { uni?: { showToast?: (o: { title: string; icon: string }) => void } }).uni
  if (uni?.showToast) {
    uni.showToast({ title, icon: "none" })
    return
  }
  window.alert(title)
}

function onDistrictTap() {
  toast("区域筛选待接入")
}

function onShare() {
  toast("分享待接入")
}

function onDownload() {
  toast("下载待接入")
}

function onProjectTap(_id: string) {
  toast("楼盘详情请在小程序内打开")
}
</script>

<style scoped>
.sell-rank {
  --rpx: calc(100vw / 750);
  background: #f7f7f7;
  box-sizing: border-box;
  min-height: 100vh;
  position: relative;
}

.sell-rank__sticky {
  left: 0;
  position: sticky;
  top: 0;
  z-index: 98;
}

.sell-rank__header {
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  height: calc(210 * var(--rpx));
  position: relative;
  width: 100%;
}

.sell-rank__share-wrap {
  position: absolute;
  right: calc(32 * var(--rpx));
  top: calc(20 * var(--rpx));
}

.sell-rank__share {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  justify-content: center;
  padding: 0;
}

.sell-rank__share-icon {
  display: block;
  height: calc(44 * var(--rpx));
  width: calc(44 * var(--rpx));
}

.sell-rank__share-text {
  color: #fff;
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
}

.sell-rank__area {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  display: flex;
  height: calc(40 * var(--rpx));
  justify-content: center;
  padding: 0;
  position: absolute;
  right: calc(32 * var(--rpx));
  top: calc(120 * var(--rpx));
}

.sell-rank__area-text {
  color: #fff;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  line-height: calc(40 * var(--rpx));
}

.sell-rank__area-arrow {
  display: block;
  height: calc(28 * var(--rpx));
  margin-left: calc(12 * var(--rpx));
  width: calc(28 * var(--rpx));
}

.sell-rank__updated {
  color: hsla(0, 0%, 100%, 0.65);
  font-size: calc(24 * var(--rpx));
  left: calc(32 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin: 0;
  position: absolute;
  top: calc(126 * var(--rpx));
}

.sell-rank__tabs {
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  gap: calc(2 * var(--rpx));
  height: calc(108 * var(--rpx));
  margin-top: calc(-34 * var(--rpx));
  width: 100%;
}

.sell-rank__tab-item {
  appearance: none;
  background: transparent;
  border: none;
  flex: 1;
  height: 100%;
  padding: 0;
}

.sell-rank__main {
  background: #f7f7f7;
  padding-bottom: calc(120 * var(--rpx));
  position: relative;
  z-index: 2;
}

.sell-rank__quotation {
  align-items: center;
  background: linear-gradient(133deg, rgba(240, 249, 255, 0.65), rgba(224, 243, 255, 0.65));
  border: calc(1 * var(--rpx)) solid rgba(162, 207, 255, 0.5);
  border-radius: calc(8 * var(--rpx));
  display: flex;
  height: calc(114 * var(--rpx));
  margin: calc(24 * var(--rpx)) calc(32 * var(--rpx)) calc(12 * var(--rpx));
}

.sell-rank__quotation-item {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.sell-rank__quotation-line {
  background: #dff2ff;
  height: calc(64 * var(--rpx));
  left: 0;
  position: absolute;
  top: calc(4 * var(--rpx));
  width: calc(1 * var(--rpx));
}

.sell-rank__quotation-title {
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  font-size: calc(20 * var(--rpx));
  gap: calc(4 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin-bottom: calc(8 * var(--rpx));
}

.sell-rank__quotation-tip {
  display: block;
  height: calc(24 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.sell-rank__quotation-value {
  align-items: baseline;
  display: flex;
  justify-content: center;
}

.sell-rank__quotation-num {
  color: rgba(0, 0, 0, 0.85);
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  line-height: calc(38 * var(--rpx));
}

.sell-rank__quotation-unit {
  color: rgba(0, 0, 0, 0.85);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  position: relative;
  top: calc(-2 * var(--rpx));
}

.sell-rank__project-list {
  background: #f7f7f7;
  min-height: calc(100vh - 244 * var(--rpx) - 336 * var(--rpx));
  overflow: hidden;
  position: relative;
  width: 100%;
}

.sell-rank__water-image {
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100% auto;
  height: 100%;
  left: 0;
  opacity: 0.7;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
}

.sell-rank__loading,
.sell-rank__no-data {
  background: #fff;
  position: relative;
  z-index: 1;
}

.sell-rank__loading {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(640 * var(--rpx));
}

.sell-rank__no-data {
  padding: calc(180 * var(--rpx)) 0 calc(274 * var(--rpx));
}

.sell-rank__nodata {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sell-rank__nodata-image {
  display: block;
  height: calc(320 * var(--rpx));
  width: calc(320 * var(--rpx));
}

.sell-rank__nodata-text {
  color: rgba(0, 0, 0, 0.45);
  font-size: calc(28 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
}

.sell-rank__spinner {
  animation: sell-rank-spin 0.8s linear infinite;
  border: calc(4 * var(--rpx)) solid #ebe3d8;
  border-radius: 50%;
  border-top-color: #9a6b2f;
  height: calc(48 * var(--rpx));
  width: calc(48 * var(--rpx));
}

@keyframes sell-rank-spin {
  to {
    transform: rotate(360deg);
  }
}

.sell-rank__loading-text {
  color: rgba(0, 0, 0, 0.45);
  font-size: calc(30 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
}

.sell-rank__rank-list {
  background: #fff;
  position: relative;
  z-index: 1;
}

.sell-rank__slogan-wrap {
  background: #f7f7f7;
}

.sell-rank__slogan {
  display: block;
  height: calc(80 * var(--rpx));
  margin: 0 auto;
  padding: calc(48 * var(--rpx)) 0;
  width: calc(264 * var(--rpx));
}

.sell-rank__water-remark {
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100% auto;
  height: calc(100% - 466 * var(--rpx));
  left: 0;
  opacity: 0.7;
  pointer-events: none;
  position: absolute;
  top: calc(466 * var(--rpx));
  width: 100%;
  z-index: 4;
}

.sell-rank__bottom {
  background: #fff;
  bottom: 0;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom);
  position: fixed;
  width: 100%;
  z-index: 100;
}

.sell-rank__floats {
  bottom: calc(220 * var(--rpx) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  position: fixed;
  right: calc(32 * var(--rpx));
  width: calc(80 * var(--rpx));
  z-index: 5;
}

.sell-rank__float-btn {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  border-radius: calc(8 * var(--rpx));
  box-shadow: 0 calc(2 * var(--rpx)) calc(6 * var(--rpx)) 0 hsla(0, 1%, 71%, 0.4);
  display: flex;
  flex-direction: column;
  height: calc(84 * var(--rpx));
  justify-content: center;
  margin-top: calc(16 * var(--rpx));
  padding: 0;
  width: calc(80 * var(--rpx));
}

.sell-rank__float-icon {
  display: block;
  height: calc(36 * var(--rpx));
  width: calc(36 * var(--rpx));
}

.sell-rank__float-text {
  color: rgba(0, 0, 0, 0.85);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
}

.sell-rank__disclaimer {
  color: rgba(0, 0, 0, 0.45);
  font-size: calc(22 * var(--rpx));
  line-height: 1.5;
  margin: 0;
  padding: calc(12 * var(--rpx)) calc(32 * var(--rpx)) calc(24 * var(--rpx));
}
</style>
