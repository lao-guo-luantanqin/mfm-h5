import { computed, reactive, toRefs, watch } from "vue"
import { useRoute } from "vue-router"
import { fetchSellRank } from "@/api/sell-rank"
import type { SellRankMetric, SellRankPeriod, SellRankRow } from "@/types/sell-rank"

const METRICS: SellRankMetric[] = ["count", "area", "amount"]
const PERIODS: SellRankPeriod[] = ["month", "week", "day"]

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function formatIso(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function todayDate() {
  return formatIso(new Date())
}

function weekRangeLabel(dateStr: string) {
  const anchor = parseLocalDate(dateStr)
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

function formatDealArea(area?: number) {
  const n = Number(area ?? 0)
  if (!Number.isFinite(n) || n <= 0) return "0㎡"
  if (n >= 10000) return `${(n / 10000).toFixed(2)}万㎡`
  return `${n >= 100 ? Math.round(n) : n.toFixed(1)}㎡`
}

function formatDealAmount(amount?: number) {
  const n = Number(amount ?? 0)
  if (!Number.isFinite(n) || n <= 0) return "—"
  if (n >= 10000) return `${(n / 10000).toFixed(2)}亿`
  return `${Math.round(n)}万`
}

export function useSellRank() {
  const route = useRoute()

  const state = reactive({
    loading: false,
    period: "month" as SellRankPeriod,
    metricIndex: 0,
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth() + 1,
    currentDate: todayDate(),
    districtLabel: "全城",
    rows: [] as SellRankRow[],
    updatedAt: "",
    disclaimer: "",
  })

  const metricItems = [
    { key: "count" as const, label: "网签套数" },
    { key: "area" as const, label: "网签面积" },
    { key: "amount" as const, label: "网签总额" },
  ]

  const periodLabel = computed(() => {
    if (state.period === "day") return "日度数据"
    if (state.period === "week") return "周度数据"
    return "月度数据"
  })

  const metricColumnLabel = computed(() => metricItems[state.metricIndex]?.label ?? "网签套数")

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

  function metricCellText(row: SellRankRow) {
    const key = METRICS[state.metricIndex]
    if (key === "area") return formatDealArea(row.dealArea)
    if (key === "amount") return formatDealAmount(row.dealAmount)
    return `${row.dealCount ?? 0}套`
  }

  function areaLine(row: SellRankRow) {
    return [row.districtName, row.plateName].filter(Boolean).join(" ")
  }

  function rankBadgeClass(rank?: number) {
    if (rank === 1) return "sell-rank__badge--1"
    if (rank === 2) return "sell-rank__badge--2"
    if (rank === 3) return "sell-rank__badge--3"
    return "sell-rank__badge--default"
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
    const next = parseLocalDate(state.currentDate)
    next.setDate(next.getDate() + deltaDays)
    const today = parseLocalDate(todayDate())
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
    if (state.period === "month") shiftMonth(1)
    else if (state.period === "day") shiftDate(1)
    else shiftDate(7)
  }

  function cyclePeriod() {
    const idx = PERIODS.indexOf(state.period)
    state.period = PERIODS[(idx + 1) % PERIODS.length]
    state.currentDate = todayDate()
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

  function initFromRoute() {
    const q = route.query
    if (q.period === "day" || q.period === "week" || q.period === "month") {
      state.period = q.period
    }
    if (typeof q.date === "string" && q.date) state.currentDate = q.date
    if (q.year) state.viewYear = Number(q.year)
    if (q.month) state.viewMonth = Number(q.month)
    if (q.metric === "area") state.metricIndex = 1
    else if (q.metric === "amount") state.metricIndex = 2
  }

  initFromRoute()

  watch(
    () => [state.period, state.metricIndex, state.viewYear, state.viewMonth, state.currentDate] as const,
    () => {
      void loadRank()
    },
    { immediate: true },
  )

  return {
    ...toRefs(state),
    metricItems,
    periodLabel,
    metricColumnLabel,
    rangeLabel,
    prevLabel,
    nextLabel,
    metricCellText,
    areaLine,
    rankBadgeClass,
    onPrev,
    onNext,
    cyclePeriod,
    selectMetric,
  }
}
