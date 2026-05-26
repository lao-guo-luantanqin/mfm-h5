<script setup lang="ts">
import { computed } from "vue"
import { IMG } from "@/config/house-search-rank"
import type { HouseSearchRankItem } from "@/types/house-search-rank"

const props = defineProps<{
  item: HouseSearchRankItem
  rankIndex: number
}>()

const emit = defineEmits<{
  (e: "click", item: HouseSearchRankItem): void
}>()

const rankBadge = computed(
  () => IMG.rankBadges[Math.min(props.rankIndex, IMG.rankBadges.length - 1)],
)

const layoutText = computed(() => {
  const room = props.item.room
  const hall = props.item.hall
  if (typeof room === "number" && typeof hall === "number") {
    return `${room}室${hall}厅`
  }
  return ""
})

const coverUrl = computed(() => props.item.cover?.url || IMG.coverFallback)

const isBargainCover = computed(() => props.item.saleStatus === 30 && !props.item.cover?.url)

const priceChangeAbs = computed(() => {
  const value = props.item.priceChange
  if (typeof value !== "number") return null
  return Math.abs(value)
})

const bargainIcon = computed(() => {
  const value = props.item.priceChange
  if (typeof value !== "number" || value === 0) return ""
  return value > 0 ? IMG.priceUpIcon : IMG.priceDownGreenIcon
})

const displayTags = computed(() => props.item.tags ?? [])
</script>

<template>
  <article class="hs-item" @click="emit('click', item)">
    <div class="hs-item__row">
      <div v-if="coverUrl && !isBargainCover" class="hs-item__cover-wrap" :class="{ 'hs-item__cover-wrap--dim': item.saleStatus === 20 }">
        <img class="hs-item__cover" :src="coverUrl" alt="" loading="lazy" />
        <div v-if="item.saleStatus === 30" class="hs-item__cover-gradient" />
        <div v-if="item.saleStatus === 30" class="hs-item__cover-price">
          <span class="hs-item__cover-price-label">砍价幅度</span>
          <img v-if="priceChangeAbs" class="hs-item__cover-price-icon" :src="IMG.priceDownIcon" alt="" />
          <span v-if="priceChangeAbs" class="hs-item__cover-price-num">{{ priceChangeAbs }}万</span>
          <span v-else class="hs-item__cover-price-num hs-item__cover-price-num--flat">持平</span>
        </div>
        <div
          v-if="item.rank && item.rank <= 100"
          class="hs-item__rank"
          :style="{ '--rank-img': `url(${rankBadge})` }"
        >
          {{ item.rank }}
        </div>
      </div>

      <div v-else-if="isBargainCover" class="hs-item__bargain-cover" :class="{ 'hs-item__cover-wrap--dim': item.saleStatus === 20 }">
        <span class="hs-item__bargain-label">砍价幅度</span>
        <div class="hs-item__bargain-line">
          <img v-if="bargainIcon" class="hs-item__bargain-icon" :src="bargainIcon" alt="" />
          <span
            v-if="priceChangeAbs"
            class="hs-item__bargain-num"
            :class="{
              'hs-item__bargain-num--up': (item.priceChange ?? 0) > 0,
              'hs-item__bargain-num--down': (item.priceChange ?? 0) < 0,
            }"
          >
            {{ priceChangeAbs }}万
          </span>
          <span v-else class="hs-item__bargain-num hs-item__bargain-num--flat">持平</span>
        </div>
        <div
          v-if="item.rank && item.rank <= 100"
          class="hs-item__rank"
          :style="{ '--rank-img': `url(${rankBadge})` }"
        >
          {{ item.rank }}
        </div>
      </div>

      <div class="hs-item__info" :class="{ 'hs-item__info--dim': item.saleStatus === 20 }">
        <h3 class="hs-item__title">
          {{ item.apartmentName ?? "—" }}
          <template v-if="layoutText"> {{ layoutText }}</template>
        </h3>
        <p v-if="item.displayRoomNum || item.subTitle" class="hs-item__sub">
          {{ item.displayRoomNum || item.subTitle }}
        </p>
        <p v-if="item.areaName || item.bizCircle" class="hs-item__area">
          {{ item.areaName }}<template v-if="item.areaName && item.bizCircle"> </template>{{ item.bizCircle }}
        </p>
        <div v-if="displayTags.length" class="hs-item__tags">
          <template v-for="(tag, index) in displayTags" :key="`${tag.key ?? tag.title}-${index}`">
            <img v-if="tag.tagImage" class="hs-item__tag-img" :src="tag.tagImage" alt="" />
            <span
              v-else-if="tag.title"
              class="hs-item__tag-text"
              :style="{ color: tag.textColor, backgroundColor: tag.bgColor }"
            >
              {{ tag.title }}
            </span>
          </template>
        </div>
        <div class="hs-item__price-row">
          <span class="hs-item__total" :class="{ 'hs-item__total--plain': item.saleStatus === 20 }">
            {{ item.showTotalPrice || "暂无价格" }}
          </span>
          <span v-if="item.showUnitPrice" class="hs-item__unit">{{ item.showUnitPrice }}</span>
        </div>
        <div v-if="item.priceReductionLabel" class="hs-item__reduction">
          <img class="hs-item__reduction-icon" :src="IMG.priceReductionIcon" alt="" />
          <span>{{ item.priceReductionLabel }}</span>
        </div>
        <p v-if="item.checkTime" class="hs-item__time">{{ item.checkTime }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.hs-item {
  --rpx: calc(100vw / 750);
  border-top: calc(1 * var(--rpx)) solid rgb(0 0 0 / 7%);
  padding: calc(24 * var(--rpx)) 0;
}

.hs-item:first-child {
  border-top: none;
}

.hs-item__row {
  display: flex;
  position: relative;
}

.hs-item__cover-wrap,
.hs-item__bargain-cover {
  flex-shrink: 0;
  height: calc(180 * var(--rpx));
  margin-right: calc(22 * var(--rpx));
  margin-top: calc(4 * var(--rpx));
  position: relative;
  width: calc(216 * var(--rpx));
}

.hs-item__cover-wrap--dim,
.hs-item__info--dim {
  opacity: 0.45;
}

.hs-item__cover {
  border: calc(1 * var(--rpx)) solid rgb(0 0 0 / 7%);
  border-radius: calc(8 * var(--rpx));
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.hs-item__cover-gradient {
  background: linear-gradient(180deg, transparent, rgb(0 0 0 / 45%) 60%, rgb(0 0 0 / 65%));
  border-radius: 0 0 calc(8 * var(--rpx)) calc(8 * var(--rpx));
  bottom: 0;
  height: calc(64 * var(--rpx));
  left: 0;
  position: absolute;
  width: 100%;
}

.hs-item__cover-price {
  align-items: center;
  bottom: calc(8 * var(--rpx));
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  width: 100%;
}

.hs-item__cover-price-label {
  color: #fff;
  font-size: calc(22 * var(--rpx));
  line-height: calc(32 * var(--rpx));
  margin-right: calc(8 * var(--rpx));
}

.hs-item__cover-price-icon {
  height: calc(10 * var(--rpx));
  margin-right: calc(4 * var(--rpx));
  width: calc(12 * var(--rpx));
}

.hs-item__cover-price-num {
  color: #fff;
  font-size: calc(22 * var(--rpx));
  font-weight: 700;
  line-height: calc(32 * var(--rpx));
}

.hs-item__cover-price-num--flat {
  font-size: calc(20 * var(--rpx));
}

.hs-item__bargain-cover {
  align-items: center;
  background: url(https://imgcdn.huanjutang.com/image/2024/06/03/0ca94187862a06bc6d1a800dc6694342.png)
    no-repeat top / 100% 100%;
  border-radius: calc(8 * var(--rpx));
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hs-item__bargain-label {
  color: rgb(0 0 0 / 85%);
  font-size: calc(24 * var(--rpx));
  line-height: calc(32 * var(--rpx));
}

.hs-item__bargain-line {
  align-items: center;
  display: flex;
  margin-top: calc(12 * var(--rpx));
}

.hs-item__bargain-icon {
  height: calc(18 * var(--rpx));
  margin-right: calc(4 * var(--rpx));
  width: calc(18 * var(--rpx));
}

.hs-item__bargain-num {
  color: rgb(0 0 0 / 85%);
  font-size: calc(36 * var(--rpx));
  font-weight: 700;
  line-height: calc(36 * var(--rpx));
}

.hs-item__bargain-num--up {
  color: #f03c50;
}

.hs-item__bargain-num--down {
  color: #0ab464;
}

.hs-item__bargain-num--flat {
  font-size: calc(32 * var(--rpx));
}

.hs-item__rank {
  align-items: center;
  background: var(--rank-img) no-repeat 0 0 / 100% 100%;
  color: #36312b;
  display: flex;
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  height: calc(54 * var(--rpx));
  justify-content: center;
  line-height: calc(34 * var(--rpx));
  position: absolute;
  right: calc(8 * var(--rpx));
  top: calc(-6 * var(--rpx));
  width: calc(44 * var(--rpx));
  z-index: 1;
}

.hs-item__info {
  flex: 1;
  min-width: 0;
  position: relative;
}

.hs-item__title {
  color: rgb(0 0 0 / 85%);
  display: -webkit-box;
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  line-height: calc(40 * var(--rpx));
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  width: calc(370 * var(--rpx));
}

.hs-item__sub,
.hs-item__area {
  color: rgb(0 0 0 / 65%);
  font-size: calc(22 * var(--rpx));
  line-height: calc(24 * var(--rpx));
  margin: calc(12 * var(--rpx)) 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hs-item__tags {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: calc(8 * var(--rpx));
  height: calc(32 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
  overflow: hidden;
}

.hs-item__tag-img {
  display: block;
  height: calc(32 * var(--rpx));
  max-width: calc(180 * var(--rpx));
}

.hs-item__tag-text {
  border-radius: calc(4 * var(--rpx));
  font-size: calc(20 * var(--rpx));
  line-height: calc(32 * var(--rpx));
  padding: 0 calc(8 * var(--rpx));
}

.hs-item__price-row {
  align-items: flex-end;
  display: flex;
  gap: calc(8 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
}

.hs-item__total {
  color: #f03c50;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  line-height: calc(28 * var(--rpx));
}

.hs-item__total--plain {
  color: rgb(0 0 0 / 85%);
}

.hs-item__unit {
  color: rgb(0 0 0 / 85%);
  font-size: calc(22 * var(--rpx));
  line-height: calc(24 * var(--rpx));
}

.hs-item__reduction {
  align-items: center;
  color: rgb(0 0 0 / 85%);
  display: flex;
  font-size: calc(20 * var(--rpx));
  gap: calc(6 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin-top: calc(14 * var(--rpx));
}

.hs-item__reduction-icon {
  height: calc(24 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.hs-item__time {
  color: rgb(0 0 0 / 85%);
  font-size: calc(20 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  margin: calc(16 * var(--rpx)) 0 0;
}
</style>
