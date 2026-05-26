<template>
  <button
    type="button"
    class="rank-item"
    :class="[bodyClass, rankTierClass(row.rank)]"
    @click="emit('projectTap', row._id ?? '')"
  >
    <span class="rank-item__rate" :style="{ width: rateWidth }" aria-hidden="true" />
    <span class="rank-item__num">
      <span class="rank-item__num-text">{{ row.rank }}</span>
    </span>
    <span class="rank-item__value">
      <span class="rank-item__name">{{ row.projectName || "—" }}</span>
      <span v-if="areaLine" class="rank-item__area">{{ areaLine }}</span>
    </span>
    <span class="rank-item__value rank-item__value--price">
      <span class="rank-item__cell">{{ row.avgPriceDisplay || "—" }}</span>
    </span>
    <span class="rank-item__value rank-item__value--price">
      <span class="rank-item__cell">{{ row.totalPriceDisplay || "—" }}</span>
    </span>
    <span class="rank-item__last rank-item__last--metric">{{ metricText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IMG } from "@/config/sell-rank"
import type { SellRankMetric, SellRankRow } from "@/types/sell-rank"
import { formatDealAmount, formatDealArea, formatDealCount } from "@/utils/sell-rank-format"

const props = defineProps<{
  row: SellRankRow
  metric: SellRankMetric
  bodyClass: string
  maxMetricValue: number
}>()

const emit = defineEmits<{
  projectTap: [id: string]
}>()

const areaLine = computed(() => {
  const parts = [props.row.districtName, props.row.plateName].filter(Boolean)
  return parts.join(" ")
})

const metricText = computed(() => {
  if (props.metric === "area") return formatDealArea(props.row.dealArea)
  if (props.metric === "amount") return formatDealAmount(props.row.dealAmount)
  return formatDealCount(props.row.dealCount)
})

const rateWidth = computed(() => {
  const value =
    props.metric === "area"
      ? Number(props.row.dealArea ?? 0)
      : props.metric === "amount"
        ? Number(props.row.dealAmount ?? 0)
        : Number(props.row.dealCount ?? 0)
  if (!props.maxMetricValue || value <= 0) return "0%"
  return `${Math.max(12, Math.round((value / props.maxMetricValue) * 100))}%`
})

function rankTierClass(rank?: number) {
  if (rank === 1) return "one"
  if (rank === 2) return "two"
  if (rank === 3) return "three"
  return ""
}
</script>

<style scoped>
.rank-item {
  align-items: center;
  appearance: none;
  background: hsla(0, 0%, 100%, 0);
  border: none;
  border-bottom: calc(1 * var(--rpx)) solid rgba(0, 0, 0, 0.07);
  box-sizing: border-box;
  display: flex;
  padding: calc(20 * var(--rpx)) 0 calc(22 * var(--rpx)) calc(8 * var(--rpx));
  position: relative;
  text-align: left;
  width: 100%;
}

.rank-item:last-child {
  border-bottom: calc(1 * var(--rpx)) solid #fff;
}

.rank-item.one,
.rank-item.two,
.rank-item.three {
  border-bottom: calc(1 * var(--rpx)) solid #fff;
}

.rank-item__rate {
  background: rgba(175, 187, 193, 0.1);
  height: 100%;
  left: 0;
  min-width: calc(72 * var(--rpx));
  pointer-events: none;
  position: absolute;
  top: 0;
}

.rank-item.one .rank-item__rate {
  background: rgba(253, 223, 42, 0.1);
}

.rank-item.two .rank-item__rate {
  background: rgba(97, 176, 255, 0.1);
}

.rank-item.three .rank-item__rate {
  background: hsla(27, 85%, 78%, 0.1);
}

.rank-item__num {
  background: v-bind("`url(${IMG.rankDefault})`") no-repeat top / 100% 100%;
  flex-shrink: 0;
  height: calc(60 * var(--rpx));
  margin-right: calc(12 * var(--rpx));
  position: relative;
  width: calc(60 * var(--rpx));
}

.rank-item.one .rank-item__num {
  background-image: v-bind("`url(${IMG.rankOne})`");
}

.rank-item.two .rank-item__num {
  background-image: v-bind("`url(${IMG.rankTwo})`");
}

.rank-item.three .rank-item__num {
  background-image: v-bind("`url(${IMG.rankThree})`");
}

.rank-item__num-text {
  color: #36312b;
  font-size: calc(26 * var(--rpx));
  font-weight: 700;
  left: 50%;
  line-height: calc(36 * var(--rpx));
  position: absolute;
  top: calc(20 * var(--rpx));
  transform: translateX(-50%);
}

.rank-item__value {
  flex-shrink: 0;
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  width: calc(200 * var(--rpx));
}

.rank-item__name {
  color: rgba(0, 0, 0, 0.85);
  display: -webkit-box;
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: calc(30 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(174 * var(--rpx));
}

.rank-item__area {
  color: rgba(0, 0, 0, 0.45);
  display: -webkit-box;
  font-size: calc(20 * var(--rpx));
  font-weight: 400;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: calc(24 * var(--rpx));
  margin-top: calc(6 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(174 * var(--rpx));
}

.rank-item__value--price {
  width: calc(176 * var(--rpx));
}

.rank-item__cell {
  color: rgba(0, 0, 0, 0.85);
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  line-height: calc(36 * var(--rpx));
}

.rank-item__last {
  color: #f03c50;
  flex: 1;
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  line-height: calc(36 * var(--rpx));
  min-width: 0;
}

.rank-item.body3 .rank-item__value {
  width: calc(260 * var(--rpx));
}

.rank-item.body3 .rank-item__name,
.rank-item.body3 .rank-item__area {
  width: calc(234 * var(--rpx));
}

.rank-item.body3 .rank-item__value:nth-of-type(3) {
  width: calc(226 * var(--rpx)) !important;
}

.rank-item.body4 .rank-item__value {
  width: calc(260 * var(--rpx));
}

.rank-item.body4 .rank-item__name,
.rank-item.body4 .rank-item__area {
  width: calc(234 * var(--rpx));
}

.rank-item.body4 .rank-item__value:nth-of-type(3) {
  width: calc(162 * var(--rpx));
}

.rank-item.body4 .rank-item__value--price {
  text-align: center;
}

.rank-item.body4 .rank-item__last {
  flex: 1;
  margin-left: calc(38 * var(--rpx));
  margin-right: calc(38 * var(--rpx));
  text-align: center;
}

.rank-item.body5 .rank-item__value:nth-of-type(4) {
  width: calc(176 * var(--rpx));
  text-align: center;
}

.rank-item.body5 .rank-item__last {
  text-align: center;
  width: calc(66 * var(--rpx));
}
</style>
