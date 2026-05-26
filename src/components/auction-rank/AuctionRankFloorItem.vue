<template>
  <button
    type="button"
    class="auction-rank-floor-item"
    :class="{ 'auction-rank-floor-item--self': isSelf }"
    @click="emit('open', item.auctionId)"
  >
    <img class="auction-rank-floor-item__bg" :src="rankBg" alt="" />
    <span v-if="showRankText" class="auction-rank-floor-item__rank">{{ item.rankNum }}</span>
    <div class="auction-rank-floor-item__left">
      <p class="auction-rank-floor-item__title">{{ item.areaName || "-" }}</p>
      <div class="auction-rank-floor-item__meta">
        <span class="auction-rank-floor-item__brand">
          <span class="auction-rank-floor-item__brand-text">{{ item.biddingResult || "" }}</span>
          <span>{{ item.netLandSquare || "" }}</span>
        </span>
        <span v-if="item.fixtureDate" class="auction-rank-floor-item__date">
          {{ item.fixtureDate }}成交
        </span>
      </div>
    </div>
    <div class="auction-rank-floor-item__price">
      <span class="auction-rank-floor-item__num">{{ displayValue }}</span>
      <span class="auction-rank-floor-item__unit">{{ unit }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IMG, RANK_BG_BY_NUM } from "@/config/auction-rank"
import type { AuctionRankItem } from "@/types/auction-rank"

interface Props {
  item: AuctionRankItem
  unit?: string
  isSelf?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ open: [auctionId?: string] }>()

const rankBg = computed(
  () => RANK_BG_BY_NUM[props.item.rankNum || 0] || IMG.rankBgDefault,
)
const showRankText = computed(
  () => (props.item.rankNum || 0) > 3 || props.item.rankNum === 0,
)
const displayValue = computed(() => {
  if (props.unit === "%") {
    return props.item.premiumRate ?? ""
  }
  return props.item.transactionFloorPrice ?? ""
})
</script>

<style scoped lang="scss">
.auction-rank-floor-item {
  --rpx: calc(100vw / 750);

  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: #ffd8a1;
  display: flex;
  height: calc(120 * var(--rpx));
  justify-content: space-between;
  margin: 0 calc(24 * var(--rpx)) calc(24 * var(--rpx));
  padding: 0 calc(20 * var(--rpx)) 0 calc(106 * var(--rpx));
  position: relative;
  text-align: left;
  width: calc(100% - 48 * var(--rpx));

  &--self {
    border: calc(4 * var(--rpx)) solid #fa7832;
    border-radius: calc(18 * var(--rpx));
    color: #792800;
  }
}

.auction-rank-floor-item__bg {
  height: 100%;
  left: 0;
  object-fit: fill;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.auction-rank-floor-item__rank {
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

.auction-rank-floor-item__left {
  max-width: calc(300 * var(--rpx));
  position: relative;
  z-index: 2;
}

.auction-rank-floor-item__title {
  font-size: calc(32 * var(--rpx));
  font-weight: 600;
  line-height: calc(44 * var(--rpx));
  margin: 0;
  max-width: calc(300 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auction-rank-floor-item__meta {
  align-items: center;
  display: flex;
  margin-top: calc(6 * var(--rpx));
}

.auction-rank-floor-item__brand {
  align-items: center;
  display: flex;
  font-size: calc(22 * var(--rpx));
  line-height: calc(24 * var(--rpx));
  white-space: nowrap;
}

.auction-rank-floor-item__brand-text {
  display: inline-block;
  max-width: calc(100 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auction-rank-floor-item__date {
  font-size: calc(22 * var(--rpx));
  line-height: calc(24 * var(--rpx));
  margin-left: calc(12 * var(--rpx));
  white-space: nowrap;
}

.auction-rank-floor-item__price {
  align-items: center;
  display: flex;
  position: relative;
  z-index: 2;
}

.auction-rank-floor-item__num {
  font-size: calc(44 * var(--rpx));
  font-weight: 600;
  line-height: calc(58 * var(--rpx));
}

.auction-rank-floor-item__unit {
  font-size: calc(20 * var(--rpx));
  font-weight: 600;
  line-height: calc(24 * var(--rpx));
  margin-left: calc(4 * var(--rpx));
  position: relative;
  top: calc(6 * var(--rpx));
}
</style>
