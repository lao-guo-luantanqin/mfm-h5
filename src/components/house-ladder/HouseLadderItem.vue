<script setup lang="ts">
import { computed } from "vue"
import { IMG } from "@/config/house-ladder-rank"
import type { HouseLadderLevel, HouseLadderRankItem } from "@/types/house-ladder-rank"

const props = defineProps<{
  item: HouseLadderRankItem
}>()

const emit = defineEmits<{
  (e: "click", item: HouseLadderRankItem): void
  (e: "preview-image", url: string): void
}>()

const level = computed(() => props.item.level as HouseLadderLevel)

const proportionStyle = computed(() => ({
  width: `${Math.min(Math.max((props.item.percent ?? 0) * 100, 0), 100)}%`,
}))

function onCoverClick(event: MouseEvent) {
  event.stopPropagation()
  if (props.item.image) {
    emit("preview-image", props.item.image)
  }
}
</script>

<template>
  <article
    class="house-ladder-item"
    :class="`house-ladder-item--${level}`"
    :style="{ backgroundImage: `url(${IMG.cardBg[level]})` }"
    @click="emit('click', item)"
  >
    <div
      class="house-ladder-item__proportion"
      :class="`house-ladder-item__proportion--${level}`"
      :style="proportionStyle"
    />
    <div class="house-ladder-item__wrap">
      <button type="button" class="house-ladder-item__cover" @click="onCoverClick">
        <img v-if="item.image" class="house-ladder-item__thumb" :src="item.image" alt="" />
      </button>
      <div
        class="house-ladder-item__level"
        :class="`house-ladder-item__level--${level}`"
        :style="{ backgroundImage: `url(${IMG.levelBadge[level]})` }"
      />
      <div class="house-ladder-item__main">
        <h3 class="house-ladder-item__title">{{ item.square }} {{ item.room }}</h3>
        <div class="house-ladder-item__project">
          <span class="house-ladder-item__project-name">{{ item.projectName ?? "—" }}</span>
          <img class="house-ladder-item__project-arrow" :src="IMG.projectArrow" alt="" />
        </div>
      </div>
      <div class="house-ladder-item__rate">
        <span class="house-ladder-item__rate-value">{{ item.squareRatio ?? 0 }}%</span>
        <span class="house-ladder-item__rate-tag">实得率</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.house-ladder-item {
  --rpx: calc(100vw / 750);
  border-radius: calc(12 * var(--rpx));
  box-sizing: border-box;
  color: #ffe4a8;
  line-height: 1;
  margin-bottom: calc(24 * var(--rpx));
  overflow: hidden;
  padding: calc(10 * var(--rpx)) calc(22 * var(--rpx)) calc(10 * var(--rpx)) calc(2 * var(--rpx));
  position: relative;
}

.house-ladder-item__wrap {
  align-items: center;
  display: flex;
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 1;
}

.house-ladder-item__cover {
  appearance: none;
  background: #fff;
  border: none;
  border-radius: calc(10 * var(--rpx));
  flex-shrink: 0;
  height: calc(140 * var(--rpx));
  margin-right: calc(32 * var(--rpx));
  overflow: hidden;
  padding: 0;
  width: calc(140 * var(--rpx));
}

.house-ladder-item__thumb {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.house-ladder-item__level {
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  flex-shrink: 0;
  height: calc(76 * var(--rpx));
  margin-right: calc(16 * var(--rpx));
  width: calc(54 * var(--rpx));
}

.house-ladder-item__main {
  flex: 1;
  min-width: 0;
}

.house-ladder-item__title {
  font-size: calc(32 * var(--rpx));
  font-weight: 500;
  margin: 0 0 calc(14 * var(--rpx));
}

.house-ladder-item__project {
  align-items: center;
  display: flex;
  margin-right: calc(20 * var(--rpx));
}

.house-ladder-item__project-name {
  font-size: calc(24 * var(--rpx));
  max-width: calc(310 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.house-ladder-item__project-arrow {
  height: calc(20 * var(--rpx));
  margin-left: calc(4 * var(--rpx));
  width: calc(16 * var(--rpx));
}

.house-ladder-item__rate {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.house-ladder-item__rate-value {
  font-size: calc(40 * var(--rpx));
  font-weight: 600;
  line-height: calc(56 * var(--rpx));
}

.house-ladder-item__rate-tag {
  background: #ffe4a8;
  border-radius: calc(20 * var(--rpx));
  color: #241000;
  font-size: calc(20 * var(--rpx));
  height: calc(36 * var(--rpx));
  line-height: calc(36 * var(--rpx));
  text-align: center;
  width: calc(84 * var(--rpx));
}

.house-ladder-item__proportion {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  z-index: 0;
}

.house-ladder-item__proportion--S {
  background: linear-gradient(270deg, rgba(255, 72, 72, 0.4), rgba(255, 72, 72, 0));
}

.house-ladder-item__proportion--A {
  background: linear-gradient(270deg, rgba(250, 137, 50, 0.4), rgba(250, 137, 50, 0));
}

.house-ladder-item__proportion--B {
  background: linear-gradient(270deg, rgba(34, 194, 233, 0.4), rgba(34, 194, 233, 0));
}

.house-ladder-item__proportion--C {
  background: linear-gradient(270deg, rgba(48, 110, 87, 0.4), rgba(48, 110, 87, 0));
}
</style>
