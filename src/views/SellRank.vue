<template>
  <div class="sell-rank">
    <header class="sell-rank__nav">
      <button type="button" class="sell-rank__back" @click="onBack">‹</button>
      <h1 class="sell-rank__title">新房网签榜</h1>
    </header>

    <div class="sell-rank__toolbar">
      <div class="sell-rank__metrics">
        <button
          v-for="(m, i) in metricLabels"
          :key="m"
          type="button"
          :class="['sell-rank__metric', { 'sell-rank__metric--on': metricIndex === i }]"
          @click="metricIndex = i"
        >
          {{ m }}
        </button>
      </div>
      <div class="sell-rank__period">
        <button type="button" @click="shiftMonth(-1)">‹</button>
        <span>{{ periodLabel }}</span>
        <button type="button" @click="shiftMonth(1)">›</button>
      </div>
      <p v-if="updatedAt" class="sell-rank__updated">更新于 {{ updatedAt }}</p>
    </div>

    <p v-if="loading" class="sell-rank__loading">加载中…</p>

    <ol v-else class="sell-rank__list">
      <li v-for="row in rows" :key="row._id" class="sell-rank__row">
        <span class="sell-rank__rank">{{ row.rank ?? "—" }}</span>
        <div class="sell-rank__main">
          <strong>{{ row.projectName || "—" }}</strong>
          <span class="sell-rank__sub">
            {{ [row.districtName, row.plateName].filter(Boolean).join(" · ") }}
          </span>
        </div>
        <span class="sell-rank__val">{{ metricValue(row) }}</span>
      </li>
    </ol>

    <p v-if="disclaimer" class="sell-rank__disclaimer">{{ disclaimer }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { fetchSellRank } from "@/api/sell-rank"
import type { SellRankMetric, SellRankPeriod, SellRankRow } from "@/types/sell-rank"

const router = useRouter()
const METRICS: SellRankMetric[] = ["count", "area", "amount"]
const metricLabels = ["套数", "面积", "金额"]
const metricIndex = ref(0)
const period = ref<SellRankPeriod>("month")
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth() + 1)
const loading = ref(false)
const rows = ref<SellRankRow[]>([])
const updatedAt = ref("")
const disclaimer = ref("")

const periodLabel = computed(() => `${viewYear.value}年${viewMonth.value}月`)

async function loadRank() {
  loading.value = true
  try {
    const res = await fetchSellRank({
      period: period.value,
      metric: METRICS[metricIndex.value],
      year: viewYear.value,
      month: viewMonth.value,
    })
    rows.value = res.rows ?? []
    updatedAt.value = res.updatedAt ?? ""
    disclaimer.value = res.disclaimer ?? ""
    if (res.year) viewYear.value = res.year
    if (res.month) viewMonth.value = res.month
    if (res.period) period.value = res.period
  } finally {
    loading.value = false
  }
}

watch([metricIndex, viewYear, viewMonth], () => {
  void loadRank()
})

void loadRank()

function metricValue(row: SellRankRow) {
  const m = METRICS[metricIndex.value]
  if (m === "count") return row.dealCount != null ? `${row.dealCount}套` : row.avgPriceDisplay ?? "—"
  if (m === "area") return row.dealArea != null ? `${row.dealArea}㎡` : "—"
  return row.dealAmount != null ? `${row.dealAmount}` : row.totalPriceDisplay ?? "—"
}

function shiftMonth(delta: number) {
  let m = viewMonth.value + delta
  let y = viewYear.value
  if (m < 1) {
    m = 12
    y -= 1
  } else if (m > 12) {
    m = 1
    y += 1
  }
  viewMonth.value = m
  viewYear.value = y
}

function onBack() {
  const uni = (window as Window & { uni?: { navigateBack?: () => void } }).uni
  if (uni?.navigateBack) {
    uni.navigateBack()
    return
  }
  router.back()
}
</script>

<style scoped>
.sell-rank {
  background: #f7f3ed;
  min-height: 100vh;
}

.sell-rank__nav {
  align-items: center;
  background: #f7f3ed;
  display: flex;
  padding: env(safe-area-inset-top) 8px 8px;
}

.sell-rank__back {
  background: none;
  border: none;
  font-size: 28px;
  padding: 8px 12px;
}

.sell-rank__title {
  flex: 1;
  font-size: 17px;
  margin: 0;
  text-align: center;
}

.sell-rank__toolbar {
  padding: 0 16px 12px;
}

.sell-rank__metrics {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.sell-rank__metric {
  background: #fff;
  border: 1px solid #e8dfd4;
  border-radius: 20px;
  font-size: 13px;
  padding: 6px 14px;
}

.sell-rank__metric--on {
  background: #5c3d1e;
  border-color: #5c3d1e;
  color: #fff;
}

.sell-rank__period {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.sell-rank__period button {
  background: none;
  border: none;
  font-size: 20px;
}

.sell-rank__updated {
  color: #999;
  font-size: 12px;
  margin: 8px 0 0;
  text-align: center;
}

.sell-rank__loading {
  padding: 24px;
  text-align: center;
}

.sell-rank__list {
  list-style: none;
  margin: 0;
  padding: 0 12px 24px;
}

.sell-rank__row {
  align-items: center;
  background: #fff;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  padding: 12px;
}

.sell-rank__rank {
  color: #c4a574;
  font-size: 18px;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}

.sell-rank__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.sell-rank__sub {
  color: #999;
  font-size: 12px;
}

.sell-rank__val {
  color: #5c3d1e;
  font-size: 14px;
  font-weight: 600;
}

.sell-rank__disclaimer {
  color: #999;
  font-size: 11px;
  line-height: 1.5;
  padding: 0 16px 24px;
}
</style>
