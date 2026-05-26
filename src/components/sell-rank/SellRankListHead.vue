<template>
  <div class="rank-list-head" :class="headerClass">
    <span class="rank-list-head__value">
      <span class="rank-list-head__label">楼盘</span>
    </span>
    <span class="rank-list-head__value rank-list-head__value--price">
      <span class="rank-list-head__label">网签均价</span>
      <span class="rank-list-head__icon" aria-hidden="true" />
    </span>
    <span class="rank-list-head__value rank-list-head__value--price">
      <span class="rank-list-head__label">网签总价</span>
      <span class="rank-list-head__icon" aria-hidden="true" />
    </span>
    <span class="rank-list-head__value rank-list-head__value--metric">
      <span class="rank-list-head__label">{{ metricLabel }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { IMG } from "@/config/sell-rank"

defineProps<{
  headerClass: string
  metricLabel: string
}>()
</script>

<style scoped>
.rank-list-head {
  align-items: center;
  background: #fff;
  display: flex;
  height: calc(64 * var(--rpx));
}

.rank-list-head__value {
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-shrink: 0;
  font-size: calc(22 * var(--rpx));
  width: calc(200 * var(--rpx));
}

.rank-list-head__value:first-child {
  margin-left: calc(80 * var(--rpx));
}

.rank-list-head__value--price {
  width: calc(176 * var(--rpx));
}

.rank-list-head__value--metric {
  flex: 1;
  min-width: 0;
}

.rank-list-head__icon {
  background: v-bind("`url(${IMG.tipIcon})`") no-repeat top / 100% 100%;
  display: inline-block;
  flex-shrink: 0;
  height: calc(24 * var(--rpx));
  margin-left: calc(4 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.rank-list-head.header1 .rank-list-head__value--metric {
  justify-content: center;
  text-align: center;
}

.rank-list-head.header2 .rank-list-head__value {
  justify-content: center;
  text-align: center;
}

.rank-list-head.header2 .rank-list-head__value:nth-of-type(3) {
  width: calc(144 * var(--rpx));
}

.rank-list-head.header3 .rank-list-head__value:nth-of-type(1) {
  width: calc(260 * var(--rpx));
}

.rank-list-head.header3 .rank-list-head__value:nth-of-type(2) {
  width: calc(226 * var(--rpx));
}

.rank-list-head.header4 .rank-list-head__value:nth-of-type(1) {
  width: calc(260 * var(--rpx));
}

.rank-list-head.header4 .rank-list-head__value:nth-of-type(2) {
  width: calc(204 * var(--rpx));
}

.rank-list-head.header5 .rank-list-head__value--metric {
  transform: translateX(calc(-16 * var(--rpx)));
}
</style>
