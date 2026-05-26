<template>
  <div ref="chartHost" class="price-graph" />
</template>

<script setup lang="ts">
import * as echarts from "echarts"
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { BAR_COLOR_STOPS } from "@/config/new-house-price-rank"
import type { NewHousePriceRankItem } from "@/types/new-house-price-rank"

const props = defineProps<{
  items: NewHousePriceRankItem[]
}>()

const emit = defineEmits<{
  projectTap: [item: NewHousePriceRankItem]
}>()

const chartHost = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

function rpx(value: number) {
  return (window.innerWidth / 750) * value
}

function rankColor(rank: number) {
  if (rank === 1) return "#FED66A"
  if (rank === 2) return "#D0E8FF"
  if (rank === 3) return "#F3CAA9"
  return "#5A669B"
}

function buildOption(items: NewHousePriceRankItem[]): echarts.EChartsOption {
  const sorted = [...items].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
  return {
    grid: {
      top: rpx(-34),
      bottom: 0,
      left: rpx(46),
      right: rpx(76),
    },
    xAxis: {
      show: false,
      max: "dataMax",
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: sorted.map((item) => item.batchId ?? ""),
      axisLine: { show: false },
      axisTick: { show: false },
      max: 10,
      axisLabel: {
        show: true,
        fontSize: rpx(28),
        fontWeight: "bold",
        color: (_value?: string | number, index?: number) => rankColor((index ?? 0) + 1),
        formatter: (value: string) => {
          const row = sorted.find((item) => item.batchId === value)
          return row ? String(row.rank) : ""
        },
      },
    },
    series: [
      {
        type: "bar",
        realtimeSort: true,
        barWidth: rpx(20),
        animationDuration: 350,
        animationDurationUpdate: 350,
        data: sorted.map((item, index) => {
          const pair = BAR_COLOR_STOPS[index % BAR_COLOR_STOPS.length]
          return {
          name: item.batchId,
          value: item.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: pair[0] },
              { offset: 0.5, color: pair[1] },
              { offset: 1, color: pair[1] },
            ]),
            borderRadius: [0, rpx(20), rpx(20), 0],
          },
        }
        }),
        label: {
          show: true,
          color: "#FFFFFF",
          distance: rpx(12),
          lineHeight: rpx(20),
          position: [0, "200%"],
          valueAnimation: true,
          formatter: (params) => {
            const row = sorted.find((item) => item.batchId === params.name)
            if (!row) return ""
            const label = row.name ?? ""
            const name = label.length > 12 ? `${label.slice(0, 12)}...` : label
            return `${name}  ${row.area}   ${row.value}万/㎡`
          },
        },
      },
    ],
    animationDuration: 0,
    animationDurationUpdate: 2000,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
  }
}

function renderChart() {
  if (!chartHost.value) return
  if (!chart) {
    chart = echarts.init(chartHost.value, undefined, { renderer: "svg" })
    chart.on("click", (params) => {
      if (params.componentType !== "series") return
      const row = props.items.find((item) => item.batchId === params.name)
      if (row) emit("projectTap", row)
    })
  }
  chart.setOption(buildOption(props.items), true)
}

function resizeChart() {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener("resize", resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart)
  chart?.dispose()
  chart = null
})

watch(
  () => props.items,
  () => {
    renderChart()
  },
  { deep: true },
)
</script>

<style scoped>
.price-graph {
  background: #1a1a28;
  box-sizing: border-box;
  height: calc(100vh - calc(100vw / 750 * 518));
  min-height: calc(100vw / 750 * 640);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 calc(100vw / 750 * 32);
  width: 100%;
}
</style>
