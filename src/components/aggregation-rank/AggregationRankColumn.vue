<script setup lang="ts">
import { computed } from "vue"
import { IMG, RANK_BADGES } from "@/config/aggregation-rank"
import type { ErshouAggregationRankColumn, ErshouAggregationRankItem } from "@/types/aggregation-rank"

const props = defineProps<{
  column: ErshouAggregationRankColumn
  tab: string
}>()

const emit = defineEmits<{
  (e: "open-detail", item: ErshouAggregationRankItem): void
  (e: "open-full", column: ErshouAggregationRankColumn): void
}>()

const collection = computed(() => props.column.collection)
const items = computed(() => props.column.data ?? [])

function rankBadge(index: number) {
  return RANK_BADGES[index] ?? ""
}

function metricValue(item: ErshouAggregationRankItem) {
  const field = collection.value?.field
  if (!field) return null
  const map: Record<string, number | undefined> = {
    trans_avg_price: item.transAvgPrice,
    trans_total_price: item.transTotalPrice,
    trans_num: item.transNum,
    tosee_num: item.toseeNum,
    price_change: item.priceChange,
  }
  return map[field] ?? null
}

function formatMetric(item: ErshouAggregationRankItem) {
  const raw = metricValue(item)
  if (raw === null || raw === undefined) return "-"
  return String(raw)
}

const headTitleUrl = computed(() => {
  const title = collection.value?.title
  return title?.startsWith("http") ? title : ""
})

const headTitleText = computed(() => {
  if (headTitleUrl.value) return ""
  return collection.value?.titleText || collection.value?.title || ""
})
</script>

<template>
  <article class="apartment-box" @click="emit('open-full', column)">
    <img v-if="headTitleUrl" class="apartment-box__head-img" :src="headTitleUrl" alt="" />
    <p v-else class="apartment-box__head-text">{{ headTitleText }}</p>

    <div
      v-for="(item, index) in items"
      :key="`${item.name}-${index}`"
      class="apartment-box__row"
      @click.stop
    >
      <div class="apartment-box__left">
        <div v-if="rankBadge(index)" class="apartment-box__rank">
          <img class="apartment-box__rank-icon" :src="rankBadge(index)" alt="" />
          <span class="apartment-box__rank-num">{{ index + 1 }}</span>
        </div>
        <button
          v-if="tab === 'apartment' && item.name && item.url"
          type="button"
          class="apartment-box__name-btn"
          @click.stop="emit('open-detail', item)"
        >
          <span class="apartment-box__text">{{ item.name }}</span>
          <img class="apartment-box__name-arrow" :src="IMG.nameArrow" alt="" />
        </button>
        <span v-else-if="item.name" class="apartment-box__text">{{ item.name }}</span>
        <span v-else class="apartment-box__text">-</span>
      </div>
      <span
        v-if="item.name"
        class="apartment-box__metric"
        :style="{ color: collection?.color || undefined }"
      >
        {{ formatMetric(item) }}{{ metricValue(item) !== null ? collection?.unit : "" }}
      </span>
    </div>

    <div class="apartment-box__nav">
      <span>查看完整榜单</span>
      <img class="apartment-box__nav-icon" :src="IMG.navArrow" alt="" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.apartment-box {
  background: linear-gradient(179deg, #ffe6cd, #fff 25%, #fff);
  border: calc(1 * var(--rpx)) solid #fff;
  border-radius: calc(24 * var(--rpx));
  box-sizing: border-box;
  height: calc(352 * var(--rpx));
  margin-bottom: calc(24 * var(--rpx));
  padding: calc(26 * var(--rpx)) calc(12 * var(--rpx)) calc(24 * var(--rpx));
  width: calc(330 * var(--rpx));
}

.apartment-box__head-img {
  height: calc(40 * var(--rpx));
  margin-bottom: calc(4 * var(--rpx));
  margin-left: calc(-12 * var(--rpx));
  width: calc(330 * var(--rpx));
}

.apartment-box__head-text {
  color: #894512;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  line-height: calc(40 * var(--rpx));
  margin: 0 0 calc(8 * var(--rpx));
  text-align: center;
}

.apartment-box__row {
  align-items: center;
  display: flex;
  height: calc(62 * var(--rpx));
  justify-content: space-between;
  margin-bottom: calc(4 * var(--rpx));
}

.apartment-box__left {
  align-items: center;
  display: flex;
  min-width: 0;
}

.apartment-box__rank {
  flex-shrink: 0;
  height: calc(44 * var(--rpx));
  margin-right: calc(12 * var(--rpx));
  position: relative;
  width: calc(44 * var(--rpx));
}

.apartment-box__rank-icon {
  height: calc(44 * var(--rpx));
  width: calc(44 * var(--rpx));
}

.apartment-box__rank-num {
  color: #36312b;
  font-size: calc(22 * var(--rpx));
  font-weight: 700;
  left: 50%;
  line-height: calc(32 * var(--rpx));
  position: absolute;
  top: calc(6 * var(--rpx));
  transform: translateX(-50%);
}

.apartment-box__name-btn {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  display: inline-flex;
  max-width: calc(144 * var(--rpx));
  min-width: 0;
  padding: 0;
}

.apartment-box__text {
  color: rgb(0 0 0 / 85%);
  display: inline-block;
  font-size: calc(24 * var(--rpx));
  font-weight: 500;
  line-height: calc(40 * var(--rpx));
  max-width: calc(144 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.apartment-box__name-arrow {
  flex-shrink: 0;
  height: calc(20 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.apartment-box__metric {
  flex-shrink: 0;
  font-size: calc(24 * var(--rpx));
  font-weight: 500;
  line-height: calc(36 * var(--rpx));
  white-space: nowrap;
}

.apartment-box__nav {
  align-items: center;
  color: #894512;
  display: flex;
  font-size: calc(24 * var(--rpx));
  justify-content: center;
  line-height: calc(34 * var(--rpx));
  margin-top: calc(20 * var(--rpx));
}

.apartment-box__nav-icon {
  height: calc(20 * var(--rpx));
  margin-left: calc(4 * var(--rpx));
  width: calc(20 * var(--rpx));
}
</style>
