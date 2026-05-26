<template>
  <div class="auction-rank-deal-item" :class="{ 'auction-rank-deal-item--self': isSelf }">
    <img class="auction-rank-deal-item__bg" :src="rankBg" alt="" />
    <span v-if="showRankText" class="auction-rank-deal-item__rank">{{ item.rankNum }}</span>
    <div class="auction-rank-deal-item__left">{{ displayName }}</div>
    <div class="auction-rank-deal-item__right">
      <div class="auction-rank-deal-item__num">
        {{ displayValue }}
        <span v-if="dealType === 'price'" class="auction-rank-deal-item__unit">亿</span>
      </div>
      <div class="auction-rank-deal-item__label">{{ labelText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IMG, RANK_BG_BY_NUM } from "@/config/auction-rank"
import type { AuctionRankItem } from "@/types/auction-rank"

interface Props {
  item: AuctionRankItem
  dealType?: string
  isSelf?: boolean
}

const props = defineProps<Props>()

const rankBg = computed(
  () => RANK_BG_BY_NUM[props.item.rankNum || 0] || IMG.rankBgDefault,
)
const showRankText = computed(
  () => (props.item.rankNum || 0) > 3 || props.item.rankNum === 0,
)
const displayName = computed(
  () => props.item.trademarkName || props.item.areaName || props.item.plateName || "-",
)
const displayValue = computed(() => {
  if (props.dealType === "price") {
    return props.item.soilPrice ?? ""
  }
  return props.item.soilNum ?? props.item.number ?? ""
})
const labelText = computed(() =>
  props.dealType === "price" ? "成交总金额" : "成交地块数",
)
</script>

<style scoped lang="scss">
.auction-rank-deal-item {
  --rpx: calc(100vw / 750);

  align-items: center;
  color: #f3c9a6;
  display: flex;
  height: calc(120 * var(--rpx));
  justify-content: space-between;
  margin: 0 calc(24 * var(--rpx)) calc(24 * var(--rpx));
  padding: 0 calc(20 * var(--rpx)) 0 calc(106 * var(--rpx));
  position: relative;

  &--self {
    border: calc(4 * var(--rpx)) solid #fa7832;
    border-radius: calc(18 * var(--rpx));
    color: #792800;
  }
}

.auction-rank-deal-item__bg {
  height: 100%;
  left: 0;
  object-fit: fill;
  position: absolute;
  top: 0;
  width: calc(702 * var(--rpx));
  z-index: 1;
}

.auction-rank-deal-item__rank {
  color: #583017;
  font-size: calc(29 * var(--rpx));
  font-weight: 600;
  left: calc(26 * var(--rpx));
  line-height: 1;
  position: absolute;
  text-align: center;
  top: calc(50 * var(--rpx));
  width: calc(56 * var(--rpx));
  z-index: 2;
}

.auction-rank-deal-item__left {
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  line-height: calc(44 * var(--rpx));
  max-width: calc(340 * var(--rpx));
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  z-index: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.auction-rank-deal-item__right {
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
}

.auction-rank-deal-item__num {
  align-items: center;
  display: flex;
  font-size: calc(40 * var(--rpx));
  font-weight: 700;
  line-height: 1;
}

.auction-rank-deal-item__unit {
  font-size: calc(24 * var(--rpx));
  line-height: calc(34 * var(--rpx));
  margin-left: calc(4 * var(--rpx));
  position: relative;
  top: calc(2 * var(--rpx));
}

.auction-rank-deal-item__label {
  font-size: calc(22 * var(--rpx));
  line-height: calc(32 * var(--rpx));
}
</style>
