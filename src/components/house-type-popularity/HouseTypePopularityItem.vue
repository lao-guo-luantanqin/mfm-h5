<script setup lang="ts">
import { computed } from "vue"
import { IMG } from "@/config/house-type-popularity-rank"
import type { HouseTypePopularityRankItem } from "@/types/house-type-popularity-rank"

const props = defineProps<{
  item: HouseTypePopularityRankItem
}>()

const emit = defineEmits<{
  (e: "click", item: HouseTypePopularityRankItem): void
  (e: "preview-image", url: string): void
}>()

const proportionStyle = computed(() => ({
  width: `${Math.min(Math.max((props.item.percent ?? 0) * 100, 0), 100)}%`,
}))

function onCoverClick(event: MouseEvent) {
  event.stopPropagation()
  if (props.item.image) emit("preview-image", props.item.image)
}
</script>

<template>
  <article class="popularity-item" @click="emit('click', item)">
    <div class="popularity-item__proportion" :style="proportionStyle" />
    <div class="popularity-item__card">
      <div class="popularity-item__left">
        <button type="button" class="popularity-item__cover" @click="onCoverClick">
          <img v-if="item.image" class="popularity-item__thumb" :src="item.image" alt="" loading="lazy" />
        </button>
        <div class="popularity-item__gradient" />
        <div v-if="item.viewCountText" class="popularity-item__view">
          <img class="popularity-item__eye" :src="IMG.eye" alt="" />
          <span class="popularity-item__view-text">{{ item.viewCountText }}</span>
        </div>
      </div>

      <div class="popularity-item__info">
        <h3 class="popularity-item__title">{{ item.room }} {{ item.square }}</h3>
        <div class="popularity-item__project">{{ item.projectName ?? "—" }}</div>
        <div v-if="item.district || item.plate" class="popularity-item__area">
          {{ item.district }}<template v-if="item.district && item.plate"> · </template>{{ item.plate }}
        </div>
      </div>

      <div class="popularity-item__rank-badge">
        <img class="popularity-item__rank-img" :src="IMG.rankBadge" alt="" />
        <span class="popularity-item__rank-num">{{ item.rank }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.popularity-item {
  --rpx: calc(100vw / 750);
  background: #fff;
  border-radius: calc(16 * var(--rpx));
  box-sizing: border-box;
  margin-bottom: calc(22 * var(--rpx));
  overflow: hidden;
  position: relative;
}

.popularity-item__proportion {
  background: linear-gradient(270deg, rgba(37, 118, 243, 0.18), rgba(37, 118, 243, 0));
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  z-index: 0;
}

.popularity-item__card {
  box-sizing: border-box;
  display: flex;
  padding: calc(26 * var(--rpx)) calc(26 * var(--rpx)) calc(26 * var(--rpx)) calc(22 * var(--rpx));
  position: relative;
  width: 100%;
  z-index: 1;
}

.popularity-item__left {
  border-radius: calc(8 * var(--rpx));
  flex-shrink: 0;
  height: calc(198 * var(--rpx));
  overflow: hidden;
  position: relative;
  width: calc(238 * var(--rpx));
}

.popularity-item__cover {
  appearance: none;
  background: #c5c3c3;
  border: none;
  display: block;
  height: 100%;
  padding: 0;
  width: 100%;
}

.popularity-item__thumb {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.popularity-item__gradient {
  background: linear-gradient(180deg, rgb(48 50 55 / 0%), #303237);
  border-radius: 0 0 calc(8 * var(--rpx)) calc(8 * var(--rpx));
  bottom: 0;
  height: calc(52 * var(--rpx));
  left: 0;
  position: absolute;
  width: 100%;
}

.popularity-item__view {
  align-items: center;
  bottom: calc(10 * var(--rpx));
  display: flex;
  left: calc(12 * var(--rpx));
  position: absolute;
  z-index: 2;
}

.popularity-item__eye {
  height: calc(26 * var(--rpx));
  width: calc(26 * var(--rpx));
}

.popularity-item__view-text {
  color: rgb(255 255 255 / 85%);
  font-size: calc(20 * var(--rpx));
  font-weight: 700;
  margin-left: calc(8 * var(--rpx));
}

.popularity-item__info {
  flex: 1;
  margin-left: calc(24 * var(--rpx));
  min-width: 0;
}

.popularity-item__title {
  color: rgb(0 0 0 / 85%);
  font-size: calc(34 * var(--rpx));
  font-weight: 700;
  line-height: calc(48 * var(--rpx));
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popularity-item__project {
  color: rgb(0 0 0 / 85%);
  font-size: calc(28 * var(--rpx));
  line-height: calc(40 * var(--rpx));
  margin-top: calc(8 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popularity-item__area {
  color: rgb(0 0 0 / 45%);
  font-size: calc(24 * var(--rpx));
  line-height: calc(34 * var(--rpx));
  margin-top: calc(8 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popularity-item__rank-badge {
  height: calc(74 * var(--rpx));
  position: absolute;
  right: calc(12 * var(--rpx));
  top: calc(-12 * var(--rpx));
  width: calc(60 * var(--rpx));
  z-index: 2;
}

.popularity-item__rank-img {
  height: 100%;
  position: absolute;
  width: 100%;
}

.popularity-item__rank-num {
  color: #fff;
  font-size: calc(30 * var(--rpx));
  font-weight: 700;
  left: 50%;
  line-height: calc(44 * var(--rpx));
  position: absolute;
  top: calc(18 * var(--rpx));
  transform: translateX(-50%);
}
</style>
