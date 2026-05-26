<script setup lang="ts">
import { computed } from "vue"
import { RANK_BADGES, IMG } from "@/config/ershou-ranking"
import type { ErshouRankingHeaderColumn, ErshouRankingItem } from "@/types/ershou-ranking"

const props = defineProps<{
  item: ErshouRankingItem
  rankIndex: number
  header: ErshouRankingHeaderColumn[]
  tab: string
  subType: string
}>()

const emit = defineEmits<{
  (e: "click", item: ErshouRankingItem): void
}>()

const rankBadge = computed(
  () => RANK_BADGES[Math.min(props.rankIndex, RANK_BADGES.length - 1)],
)

const rankClass = computed(() => {
  if (props.rankIndex === 0) return "er-item--one"
  if (props.rankIndex === 1) return "er-item--two"
  if (props.rankIndex === 2) return "er-item--three"
  return ""
})

const bodyClass = computed(() => {
  if (props.header.length === 3) return "er-item--body3"
  if (props.subType === "trans_avg_price") return "er-item--body1"
  if (props.subType === "trans_total_price") return "er-item--body2"
  if (props.subType === "trans_num") return "er-item--body5"
  return ""
})

const areaText = computed(() => {
  const parts = [props.item.areaName, props.item.bizCircleName].filter(Boolean)
  return parts.join(" ")
})

function valueFor(key?: string) {
  if (!key) return null
  const map: Record<string, number | undefined> = {
    trans_avg_price: props.item.transAvgPrice,
    trans_total_price: props.item.transTotalPrice,
    trans_num: props.item.transNum,
    tosee_num: props.item.toseeNum,
    price_change: props.item.priceChange,
    rent_trans_avg_price: props.item.rentTransAvgPrice,
    rent_return_rate: props.item.rentReturnRate,
  }
  return map[key] ?? null
}

function formatNumber(raw: number, key?: string) {
  if (key === "trans_total_price") {
    return String(Math.round(raw / 10000))
  }
  if (key === "price_change") {
    const prefix = raw > 0 ? "+" : ""
    const text = Number.isInteger(raw) ? String(raw) : raw.toFixed(2).replace(/\.?0+$/, "")
    return `${prefix}${text}`
  }
  return String(Math.round(raw))
}

function formatValue(column: ErshouRankingHeaderColumn) {
  const raw = valueFor(column.key)
  if (raw === null || raw === undefined) return "-"
  if (column.key === "trans_num" || column.key === "tosee_num") {
    const prefix = column.prepositionUnit && raw > 0 ? column.prepositionUnit : ""
    return `${prefix}${raw}`
  }
  return formatNumber(raw, column.key)
}

function metricColor(column: ErshouRankingHeaderColumn) {
  if (column.key !== "price_change") return undefined
  const value = props.item.priceChange
  if (typeof value !== "number" || value === 0) return undefined
  return value > 0 ? "#0ab464" : "#f03c50"
}

const barWidth = computed(() => {
  const percent = props.item.percent ?? 0
  const px = Math.max(percent * (typeof window !== "undefined" ? window.innerWidth : 375), 36)
  return `${px}px`
})

const showTransArrow = computed(
  () => props.tab === "apartment" && props.header.some((column) => column.key === "trans_num"),
)
</script>

<template>
  <article
    class="er-item"
    :class="[rankClass, bodyClass]"
    @click="emit('click', item)"
  >
    <div class="er-item__bar" :style="{ width: barWidth }" aria-hidden="true" />

    <div class="er-item__rank" :style="{ backgroundImage: `url(${rankBadge})` }">
      <span class="er-item__rank-num">{{ rankIndex + 1 }}</span>
    </div>

    <div class="er-item__value er-item__value--name">
      <p class="er-item__name">
        {{ item.name || "—" }}
        <img v-if="tab === 'apartment'" class="er-item__name-arrow" :src="IMG.nameArrow" alt="" />
      </p>
      <p v-if="areaText" class="er-item__area">{{ areaText }}</p>
    </div>

    <div
      v-for="(column, index) in header.slice(1)"
      :key="column.key || index"
      class="er-item__value"
      :class="{
        'er-item__value--price': column.key === 'trans_avg_price' || column.key === 'trans_total_price',
        'er-item__value--last': index === header.length - 2,
      }"
    >
      <span class="er-item__metric" :style="{ color: metricColor(column) }">
        {{ formatValue(column) }}
      </span>
      <span
        v-if="column.unit && valueFor(column.key) !== null && valueFor(column.key) !== undefined"
        class="er-item__unit"
      >
        {{ column.unit }}
      </span>
      <img
        v-if="showTransArrow && column.key === 'trans_num'"
        class="er-item__trans-arrow"
        :src="IMG.transArrow"
        alt=""
      />
    </div>
  </article>
</template>

<style scoped lang="scss">
.er-item {
  --rpx: calc(100vw / 750);
  align-items: center;
  background: #fff;
  border-bottom: calc(1 * var(--rpx)) solid rgb(0 0 0 / 7%);
  box-sizing: border-box;
  display: flex;
  padding: calc(20 * var(--rpx)) 0 calc(22 * var(--rpx)) calc(8 * var(--rpx));
  position: relative;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }
}

.er-item__bar {
  background: rgb(175 187 193 / 10%);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  z-index: 0;
}

.er-item--one {
  border-bottom-color: #fff;

  .er-item__bar {
    background: rgb(253 223 42 / 10%);
  }
}

.er-item--two {
  border-bottom-color: #fff;

  .er-item__bar {
    background: rgb(97 176 255 / 10%);
  }
}

.er-item--three {
  border-bottom-color: #fff;

  .er-item__bar {
    background: rgb(244 196 140 / 10%);
  }
}

.er-item__rank {
  background: center / 100% 100% no-repeat;
  flex-shrink: 0;
  height: calc(60 * var(--rpx));
  margin-right: calc(12 * var(--rpx));
  position: relative;
  width: calc(60 * var(--rpx));
  z-index: 1;
}

.er-item__rank-num {
  color: #36312b;
  font-size: calc(26 * var(--rpx));
  font-weight: 700;
  left: 50%;
  line-height: calc(36 * var(--rpx));
  position: absolute;
  top: calc(20 * var(--rpx));
  transform: translateX(-50%);
}

.er-item__value {
  flex-shrink: 0;
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  position: relative;
  width: calc(200 * var(--rpx));
  z-index: 1;
}

.er-item__value--name {
  width: calc(200 * var(--rpx));
}

.er-item__name {
  color: rgb(0 0 0 / 85%);
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  line-height: calc(30 * var(--rpx));
  margin: 0;
  max-width: calc(174 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.er-item__name-arrow {
  display: inline-block;
  height: calc(20 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  vertical-align: middle;
  width: calc(20 * var(--rpx));
}

.er-item__area {
  color: rgb(0 0 0 / 45%);
  font-size: calc(20 * var(--rpx));
  font-weight: 400;
  line-height: calc(24 * var(--rpx));
  margin: calc(6 * var(--rpx)) 0 0;
  max-width: calc(174 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.er-item__value--price {
  width: calc(176 * var(--rpx));
}

.er-item__value--last {
  flex: 1;
  text-align: center;
}

.er-item__metric {
  color: rgb(0 0 0 / 85%);
}

.er-item__unit {
  color: rgb(0 0 0 / 85%);
  font-size: calc(20 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
}

.er-item__trans-arrow {
  display: inline-block;
  height: calc(20 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  vertical-align: middle;
  width: calc(20 * var(--rpx));
}

.er-item--body3 {
  .er-item__value--name {
    width: calc(260 * var(--rpx));
  }

  .er-item__name,
  .er-item__area {
    max-width: calc(234 * var(--rpx));
  }

  .er-item__value--last {
    width: calc(226 * var(--rpx)) !important;
  }
}

.er-item--body5 {
  .er-item__value:nth-of-type(4) {
    text-align: center;
    width: calc(176 * var(--rpx));
  }

  .er-item__value--last {
    text-align: center;
    width: calc(66 * var(--rpx));
  }
}
</style>
