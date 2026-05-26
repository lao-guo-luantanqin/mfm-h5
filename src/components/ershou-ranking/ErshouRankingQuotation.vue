<script setup lang="ts">
import { computed } from "vue"
import { IMG } from "@/config/ershou-ranking"
import type { ErshouRankingQuotationItem } from "@/types/ershou-ranking"

const props = defineProps<{
  items: ErshouRankingQuotationItem[]
  subType: string
}>()

const emit = defineEmits<{
  (e: "tip", payload: { title?: string; content?: string }): void
}>()

const visibleItems = computed(() => props.items.filter((item) => item.title))

function formatValue(item: ErshouRankingQuotationItem, index: number) {
  const value = item.value
  if (value === null || value === undefined) return "-"
  if (index === 2 && item.unit === "%") {
    if (props.subType === "trans_avg_price") return String(value)
    if (value > 0) return `+${value}`
    return String(value)
  }
  return String(value)
}

function showPercentSuffix(item: ErshouRankingQuotationItem, index: number) {
  return index === 2 && item.unit === "%" && item.value !== null && item.value !== undefined
}
</script>

<template>
  <div v-if="visibleItems.length" class="er-quotation" :class="{ 'er-quotation--two': visibleItems.length === 2 }">
    <div
      v-for="(item, index) in visibleItems"
      :key="`${item.title}-${index}`"
      class="er-quotation__item"
    >
      <span v-if="index > 0" class="er-quotation__line" aria-hidden="true" />
      <button
        type="button"
        class="er-quotation__title"
        :disabled="!item.tips"
        @click="emit('tip', { title: item.title, content: item.tips })"
      >
        {{ item.title }}
        <img v-if="item.tips" class="er-quotation__tip-icon" :src="IMG.headerTipIcon" alt="" />
      </button>
      <div class="er-quotation__value">
        <span class="er-quotation__metric" :style="{ color: item.color || undefined }">
          {{ formatValue(item, index) }}<template v-if="showPercentSuffix(item, index)">%</template>
        </span>
        <span
          v-if="item.value !== null && item.value !== undefined && item.unit && item.unit !== '%'"
          class="er-quotation__unit"
          :style="{ color: item.color || undefined }"
        >
          {{ item.unit }}
        </span>
      </div>
    </div>
  </div>
  <div v-else class="er-quotation__spacer" aria-hidden="true" />
</template>

<style scoped lang="scss">
.er-quotation {
  align-items: center;
  background: linear-gradient(133deg, rgb(240 249 255 / 65%), rgb(224 243 255 / 65%));
  border: calc(1 * var(--rpx)) solid rgb(162 207 255 / 50%);
  border-radius: calc(8 * var(--rpx));
  display: flex;
  height: calc(114 * var(--rpx));
  margin: calc(24 * var(--rpx)) calc(32 * var(--rpx)) calc(12 * var(--rpx));
}

.er-quotation--two {
  .er-quotation__item {
    flex: 1;
  }
}

.er-quotation__item {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: calc(228 * var(--rpx));
}

.er-quotation__line {
  background: #dff2ff;
  height: calc(64 * var(--rpx));
  left: 0;
  position: absolute;
  top: calc(4 * var(--rpx));
  width: calc(2 * var(--rpx));
}

.er-quotation__title {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: rgb(0 0 0 / 45%);
  display: inline-flex;
  font-size: calc(20 * var(--rpx));
  gap: calc(4 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin: 0 0 calc(8 * var(--rpx));
  padding: 0;
}

.er-quotation__title:disabled {
  cursor: default;
}

.er-quotation__tip-icon {
  height: calc(24 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.er-quotation__value {
  align-items: baseline;
  display: inline-flex;
}

.er-quotation__metric {
  color: rgb(0 0 0 / 85%);
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  line-height: calc(38 * var(--rpx));
}

.er-quotation__unit {
  color: rgb(0 0 0 / 85%);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  position: relative;
  top: calc(-2 * var(--rpx));
}

.er-quotation__spacer {
  height: calc(16 * var(--rpx));
}
</style>
