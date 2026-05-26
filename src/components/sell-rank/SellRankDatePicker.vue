<template>
  <div class="date-picker" :class="{ 'date-picker--loading': loading }">
    <button type="button" class="date-picker__type" :class="{ 'date-picker__type--active': periodActive }" @click="emit('togglePeriod')">
      <span class="date-picker__type-text">{{ periodLabel }}</span>
      <img class="date-picker__type-icon" :src="IMG.periodArrow" alt="" />
    </button>
    <div class="date-picker__nav">
      <button type="button" class="date-picker__btn" :class="{ 'date-picker__btn--disabled': prevDisabled }" @click="emit('prev')">
        <img class="date-picker__btn-icon" :src="prevDisabled ? IMG.navPrevDisabled : IMG.navPrev" alt="" />
        <span>{{ prevLabel }}</span>
      </button>
      <span class="date-picker__title">{{ rangeLabel }}</span>
      <button type="button" class="date-picker__btn" :class="{ 'date-picker__btn--disabled': nextDisabled }" @click="emit('next')">
        <span>{{ nextLabel }}</span>
        <img class="date-picker__btn-icon" :src="nextDisabled ? IMG.navNextDisabled : IMG.navNext" alt="" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMG } from "@/config/sell-rank"

defineProps<{
  loading?: boolean
  periodLabel: string
  periodActive?: boolean
  rangeLabel: string
  prevLabel: string
  nextLabel: string
  prevDisabled?: boolean
  nextDisabled?: boolean
}>()

const emit = defineEmits<{
  togglePeriod: []
  prev: []
  next: []
}>()
</script>

<style scoped>
.date-picker {
  align-items: center;
  display: flex;
  gap: calc(18 * var(--rpx));
  height: calc(56 * var(--rpx));
  padding: calc(20 * var(--rpx)) calc(32 * var(--rpx));
}

.date-picker--loading > * {
  pointer-events: none;
}

.date-picker__type {
  align-items: center;
  appearance: none;
  background: #fff;
  border: calc(1 * var(--rpx)) solid #2d8cf0;
  border-radius: calc(8 * var(--rpx));
  display: flex;
  flex: none;
  height: calc(56 * var(--rpx));
  justify-content: center;
  padding: 0;
  width: calc(116 * var(--rpx));
}

.date-picker__type--active {
  border-color: #894512;
}

.date-picker__type-text {
  align-items: center;
  color: #2d8cf0;
  display: flex;
  font-size: calc(22 * var(--rpx));
  font-weight: 700;
  line-height: calc(36 * var(--rpx));
}

.date-picker__type--active .date-picker__type-text {
  color: #894512;
}

.date-picker__type-icon {
  display: block;
  height: calc(20 * var(--rpx));
  margin-left: calc(2 * var(--rpx));
  width: calc(20 * var(--rpx));
}

.date-picker__nav {
  align-items: center;
  border: calc(1 * var(--rpx)) solid rgba(0, 0, 0, 0.25);
  border-radius: calc(8 * var(--rpx));
  display: flex;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.date-picker__btn {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex: none;
  font-size: calc(22 * var(--rpx));
  gap: calc(2 * var(--rpx));
  height: calc(56 * var(--rpx));
  justify-content: center;
  padding: 0 calc(6 * var(--rpx));
  white-space: nowrap;
  width: calc(122 * var(--rpx));
}

.date-picker__btn:first-child {
  border-right: calc(1 * var(--rpx)) solid rgba(0, 0, 0, 0.25);
  padding-right: calc(6 * var(--rpx));
}

.date-picker__btn:last-child {
  border-left: calc(1 * var(--rpx)) solid rgba(0, 0, 0, 0.25);
  padding-left: calc(6 * var(--rpx));
}

.date-picker__btn--disabled {
  color: rgba(0, 0, 0, 0.25);
}

.date-picker__btn-icon {
  display: block;
  height: calc(24 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.date-picker__title {
  color: rgba(0, 0, 0, 0.85);
  flex: 1;
  font-size: calc(22 * var(--rpx));
  font-weight: 700;
  line-height: calc(56 * var(--rpx));
  min-width: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
