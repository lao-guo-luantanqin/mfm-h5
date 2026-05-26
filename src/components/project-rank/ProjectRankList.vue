<template>
  <div class="rank-list">
    <div v-if="loading && !rows.length" class="rank-list__state">
      <img class="rank-list__loading" :src="IMG.loading" alt="" />
      <span class="rank-list__state-text">加载中</span>
    </div>
    <div v-else-if="!rows.length" class="rank-list__state">
      <span class="rank-list__state-text">暂无榜单数据</span>
    </div>
    <div v-else class="rank-list__project">
      <article
        v-for="(row, index) in rows"
        :key="row._id ?? row.rank ?? index"
        class="rank-list__item"
        :class="rankTierClass(index)"
      >
        <div v-if="row.isHot" class="rank-list__hot-rank" :class="{ 'rank-list__hot-rank--red': index < 3 }">
          热
        </div>

        <button type="button" class="rank-list__card" @click="emit('projectTap', row)">
          <div class="rank-list__left">
            <div v-if="row.topLeftTag" class="rank-list__open-month">{{ row.topLeftTag }}</div>
            <img
              v-if="row.coverImage"
              class="rank-list__cover"
              :src="row.coverImage"
              alt=""
              loading="lazy"
            />
            <div v-else class="rank-list__cover rank-list__cover--placeholder" />
            <div class="rank-list__gradient" />
            <div v-if="row.viewCountText" class="rank-list__view">
              <img class="rank-list__eye" :src="IMG.eye" alt="" />
              <span class="rank-list__view-text">{{ row.viewCountText }}</span>
            </div>
            <div v-if="row.imageTags?.length" class="rank-list__tag-icons">
              <img
                v-for="(tag, tagIndex) in row.imageTags"
                :key="`${row._id}-tag-${tagIndex}`"
                class="rank-list__tag-icon"
                :src="tag.icon"
                alt=""
              />
            </div>
          </div>

          <div class="rank-list__info">
            <div class="rank-list__name">{{ row.projectName || "—" }}</div>
            <div class="rank-list__price">{{ row.priceDisplay || "价格待定" }}</div>
            <div class="rank-list__area">
              <span v-if="row.districtName" class="rank-list__district">{{ row.districtName }}</span>
              <span v-if="row.plateName">{{ row.plateName }}</span>
              <template v-if="row.buildingAreaRange">
                <span>/</span>
                <span>{{ row.buildingAreaRange }}</span>
              </template>
            </div>
            <div v-if="row.saleStatus || row.tagsData?.length" class="rank-list__tips">
              <span v-if="row.saleStatus" class="rank-list__tip">{{ row.saleStatus }}</span>
              <span
                v-for="(tag, tipIndex) in row.tagsData"
                :key="`${row._id}-tip-${tipIndex}`"
                class="rank-list__tip"
                :style="{ color: tag.color, backgroundColor: tag.bgColor }"
              >
                {{ tag.name }}
              </span>
            </div>
            <div v-if="displayWeight(row)" class="rank-list__weight">
              {{ displayWeight(row) }}
            </div>
          </div>

          <span class="rank-list__attention" aria-hidden="true" />
          <div class="rank-list__rank-badge">
            <img class="rank-list__rank-img" :src="rankBadge(index)" alt="" />
            <span class="rank-list__rank-num">{{ row.rank ?? index + 1 }}</span>
          </div>
        </button>
      </article>

      <div v-if="loadingMore" class="rank-list__state rank-list__state--inline">
        <img class="rank-list__loading" :src="IMG.loading" alt="" />
        <span class="rank-list__state-text">加载中</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMG, RANK_BADGES } from "@/config/project-rank"
import type { ProjectRankItem } from "@/types/project-rank"

defineProps<{
  rows: ProjectRankItem[]
  loading: boolean
  loadingMore?: boolean
}>()

const emit = defineEmits<{
  projectTap: [row: ProjectRankItem]
}>()

function rankTierClass(index: number) {
  if (index === 0) return "rank-list__item--rank1"
  if (index === 1) return "rank-list__item--rank2"
  if (index === 2) return "rank-list__item--rank3"
  return ""
}

function rankBadge(index: number) {
  return RANK_BADGES[Math.min(index, RANK_BADGES.length - 1)]
}

function displayWeight(row: ProjectRankItem) {
  return row.weightText || row.dynamicPreview || row.salesRank || ""
}
</script>

<style scoped>
.rank-list {
  margin: 0 17px;
}

.rank-list__state {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  min-height: 180px;
  padding: 24px 16px;
}

.rank-list__state--inline {
  min-height: 72px;
  padding: 16px;
}

.rank-list__loading {
  height: 28px;
  width: 28px;
}

.rank-list__state-text {
  color: rgb(255 255 255 / 85%);
  font-size: 14px;
}

.rank-list__item {
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 13px;
  position: relative;
  width: 100%;
}

.rank-list__hot-rank {
  background: url(https://imgcdn.huanjutang.com/assets/img/2019117104077887.png) 0 0 / 100% 100% no-repeat;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  height: 25px;
  left: 5px;
  line-height: 25px;
  position: absolute;
  text-align: center;
  top: 0;
  width: 24px;
  z-index: 5;
}

.rank-list__hot-rank--red {
  background-image: url(https://imgcdn.huanjutang.com/assets/img/2019117104078081.png);
}

.rank-list__card {
  appearance: none;
  background: none;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 0;
  position: relative;
  text-align: left;
  width: 100%;
}

.rank-list__left {
  border-radius: 4px;
  float: left;
  height: 99px;
  overflow: hidden;
  position: relative;
  width: 119px;
}

.rank-list__open-month {
  background: linear-gradient(135deg, #3093f8 0%, #2477f7 100%);
  border-radius: 3px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%);
  color: #fff;
  font-size: 9px;
  height: 16px;
  left: 0;
  line-height: 16px;
  padding: 0 3px;
  position: absolute;
  top: 0;
  z-index: 4;
}

.rank-list__cover {
  background: #c5c3c3;
  border-radius: 4px;
  display: block;
  height: 99px;
  object-fit: cover;
  width: 119px;
}

.rank-list__cover--placeholder {
  display: block;
}

.rank-list__gradient {
  background: linear-gradient(180deg, rgb(48 50 55 / 0%), #303237);
  border-radius: 0 0 4px 4px;
  bottom: 0;
  height: 26px;
  left: 0;
  position: absolute;
  width: 100%;
}

.rank-list__view {
  align-items: center;
  bottom: 5px;
  display: flex;
  left: 6px;
  opacity: 0.8;
  position: absolute;
  z-index: 2;
}

.rank-list__eye {
  height: 13px;
  width: 13px;
}

.rank-list__view-text {
  color: rgb(255 255 255 / 85%);
  font-size: 10px;
  font-weight: 700;
  margin-left: 4px;
}

.rank-list__tag-icons {
  bottom: 5px;
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap-reverse;
  height: 66px;
  overflow: hidden;
  position: absolute;
  right: 6px;
  text-align: center;
  width: 39px;
  z-index: 3;
}

.rank-list__tag-icon {
  border-radius: 17px;
  display: block;
  height: 17px;
  margin-left: 3px;
  margin-top: 3px;
  width: 17px;
}

.rank-list__info {
  font-size: 0;
  margin-left: 130px;
  min-height: 99px;
}

.rank-list__name {
  color: rgb(0 0 0 / 85%);
  font-size: 17px;
  font-weight: 700;
  line-height: 24px;
  margin-top: -3px;
  max-width: 187px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-list__price {
  color: #ff3b30;
  display: block;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-list__area {
  color: rgb(0 0 0 / 65%);
  font-size: 12px;
  height: 17px;
  line-height: 17px;
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-list__district {
  margin-right: 4px;
}

.rank-list__tips {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: 17px;
  margin-top: 6px;
  overflow: hidden;
}

.rank-list__tip {
  border-radius: 2px;
  display: inline-block;
  font-size: 11px;
  height: 17px;
  line-height: 17px;
  margin-left: 6px;
  padding: 0 4px;
}

.rank-list__tip:first-child {
  margin-left: 0;
}

.rank-list__weight {
  color: #828caa;
  font-size: 12px;
  line-height: 13px;
  margin-top: 8px;
}

.rank-list__attention {
  background: url(https://imgcdn.huanjutang.com/image/2022/01/12/bb5bc493bfa2e2e442c57ef920814cd9.png)
    50% / 100% 100% no-repeat;
  display: inline-block;
  height: 19px;
  padding: 8px;
  position: absolute;
  right: 3px;
  top: 33px;
  width: 19px;
}

.rank-list__rank-badge {
  height: 37px;
  position: absolute;
  right: 6px;
  top: -6px;
  width: 30px;
  z-index: 2;
}

.rank-list__rank-img {
  height: 100%;
  position: absolute;
  width: 100%;
}

.rank-list__rank-num {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  left: 50%;
  line-height: 22px;
  position: absolute;
  top: 9px;
  transform: translateX(-50%);
}

.rank-list__card::after,
.rank-list__left::after {
  clear: both;
  content: "";
  display: block;
}
</style>
