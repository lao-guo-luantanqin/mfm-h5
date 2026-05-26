<template>
  <div class="sell-rank">
    <header class="sell-rank__hero">
      <div class="sell-rank__hero-top">
        <h1 class="sell-rank__title">新房网签排行榜</h1>
        <div class="sell-rank__hero-actions">
          <button type="button" class="sell-rank__district" @click="onDistrictTap">
            <span class="sell-rank__district-text">{{ districtLabel }}</span>
            <span class="sell-rank__chevron sell-rank__chevron--down" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="sell-rank__meta-row">
        <span v-if="updatedAt" class="sell-rank__updated">更新时间: {{ updatedAt }}</span>
        <button type="button" class="sell-rank__share" @click="onShare">
          <span class="sell-rank__share-icon" aria-hidden="true">↗</span>
          <span class="sell-rank__share-text">分享</span>
        </button>
      </div>
    </header>

    <div class="sell-rank__tabs-wrap">
      <button
        v-for="(item, index) in metricItems"
        :key="item.key"
        type="button"
        class="sell-rank__tab"
        :class="{ 'sell-rank__tab--active': metricIndex === index }"
        @click="selectMetric(index)"
      >
        <span class="sell-rank__tab-text">{{ item.label }}</span>
        <span v-if="metricIndex === index" class="sell-rank__tab-bar" />
      </button>
    </div>

    <div class="sell-rank__toolbar">
      <button type="button" class="sell-rank__period" @click="cyclePeriod">
        <span class="sell-rank__period-text">{{ periodLabel }}</span>
        <span class="sell-rank__chevron" aria-hidden="true" />
      </button>
      <div class="sell-rank__nav">
        <button type="button" class="sell-rank__nav-btn" @click="onPrev">
          <span class="sell-rank__nav-btn-text">◀ {{ prevLabel }}</span>
        </button>
        <span
          class="sell-rank__nav-label"
          :class="{ 'sell-rank__nav-label--compact': period === 'week' }"
        >
          {{ rangeLabel }}
        </span>
        <button type="button" class="sell-rank__nav-btn" @click="onNext">
          <span class="sell-rank__nav-btn-text">{{ nextLabel }} ▶</span>
        </button>
      </div>
    </div>

    <div class="sell-rank__table-head">
      <span class="sell-rank__col sell-rank__col--name">楼盘</span>
      <span class="sell-rank__col sell-rank__col--avg">网签均价</span>
      <span class="sell-rank__col sell-rank__col--total">网签总价</span>
      <span class="sell-rank__col sell-rank__col--metric">{{ metricColumnLabel }}</span>
    </div>

    <div class="sell-rank__body">
      <div class="sell-rank__watermark" aria-hidden="true">
        <span v-for="n in 10" :key="n" class="sell-rank__watermark-text">济南买房么</span>
      </div>

      <div v-if="loading" class="sell-rank__state">
        <span class="sell-rank__spinner" aria-hidden="true" />
        <span class="sell-rank__state-text">加载中…</span>
      </div>
      <div v-else-if="!rows.length" class="sell-rank__state">
        <span class="sell-rank__state-text">暂无网签数据</span>
      </div>
      <div v-else class="sell-rank__list">
        <button
          v-for="row in rows"
          :key="row._id"
          type="button"
          class="sell-rank__row"
          @click="onProjectTap(row._id)"
        >
          <div class="sell-rank__row-main">
            <span class="sell-rank__badge" :class="rankBadgeClass(row.rank)">
              <span class="sell-rank__badge-top">TOP</span>
              <span class="sell-rank__badge-num">{{ row.rank }}</span>
            </span>
            <span class="sell-rank__info">
              <span class="sell-rank__name">{{ row.projectName || "—" }}</span>
              <span v-if="areaLine(row)" class="sell-rank__area">{{ areaLine(row) }}</span>
            </span>
          </div>
          <span class="sell-rank__cell sell-rank__cell--avg">{{ row.avgPriceDisplay || "—" }}</span>
          <span class="sell-rank__cell sell-rank__cell--total">{{ row.totalPriceDisplay || "—" }}</span>
          <span class="sell-rank__cell sell-rank__cell--metric">{{ metricCellText(row) }}</span>
        </button>
      </div>
    </div>

    <p v-if="disclaimer" class="sell-rank__disclaimer">{{ disclaimer }}</p>

    <button type="button" class="sell-rank__download" @click="onDownload">
      <span class="sell-rank__download-icon" aria-hidden="true">↓</span>
      <span class="sell-rank__download-text">下载</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useSellRank } from "@/composables/useSellRank"

const {
  loading,
  period,
  metricIndex,
  districtLabel,
  rows,
  updatedAt,
  disclaimer,
  metricItems,
  periodLabel,
  metricColumnLabel,
  rangeLabel,
  prevLabel,
  nextLabel,
  metricCellText,
  areaLine,
  rankBadgeClass,
  onPrev,
  onNext,
  cyclePeriod,
  selectMetric,
} = useSellRank()

onMounted(() => {
  document.title = "新房网签排行榜"
})

function toast(title: string) {
  const uni = (window as Window & { uni?: { showToast?: (o: { title: string; icon: string }) => void } }).uni
  if (uni?.showToast) {
    uni.showToast({ title, icon: "none" })
    return
  }
  window.alert(title)
}

function onDistrictTap() {
  toast("区域筛选待接入")
}

function onShare() {
  toast("分享待接入")
}

function onDownload() {
  toast("下载待接入")
}

function onProjectTap(_id: string) {
  toast("楼盘详情请在小程序内打开")
}
</script>

<style scoped>
.sell-rank {
  --rpx: calc(100vw / 750);
  --rank-gold: #c9a063;
  --rank-brown: #5c3d1e;
  --rank-beige: #f5efe6;
  --rank-red: #e64545;
  --text-main: #303133;
  --text-content: #606266;
  --text-tips: #909399;
  background: #f7f3ed;
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: calc(140 * var(--rpx));
  position: relative;
}

.sell-rank__hero {
  background: linear-gradient(135deg, #3d2814 0%, #6b4520 42%, #a67c3d 100%);
  padding: calc(8 * var(--rpx)) calc(28 * var(--rpx)) calc(24 * var(--rpx));
}

.sell-rank__hero-top {
  align-items: flex-start;
  display: flex;
  gap: calc(16 * var(--rpx));
  justify-content: space-between;
}

.sell-rank__title {
  color: var(--rank-gold);
  flex: 1;
  font-size: calc(44 * var(--rpx));
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
}

.sell-rank__hero-actions {
  flex-shrink: 0;
  padding-top: calc(8 * var(--rpx));
}

.sell-rank__district {
  align-items: center;
  appearance: none;
  background: rgba(0, 0, 0, 0.12);
  border: calc(1 * var(--rpx)) solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  display: flex;
  gap: calc(6 * var(--rpx));
  padding: calc(8 * var(--rpx)) calc(14 * var(--rpx));
}

.sell-rank__district-text {
  color: rgba(255, 255, 255, 0.92);
  font-size: calc(24 * var(--rpx));
}

.sell-rank__chevron {
  border-left: calc(5 * var(--rpx)) solid transparent;
  border-right: calc(5 * var(--rpx)) solid transparent;
  border-top: calc(6 * var(--rpx)) solid var(--text-content);
  display: inline-block;
  height: 0;
  width: 0;
}

.sell-rank__chevron--down {
  border-left: calc(5 * var(--rpx)) solid transparent;
  border-right: calc(5 * var(--rpx)) solid transparent;
  border-top: calc(6 * var(--rpx)) solid rgba(255, 255, 255, 0.85);
}

.sell-rank__meta-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: calc(12 * var(--rpx));
}

.sell-rank__updated {
  color: rgba(255, 255, 255, 0.72);
  font-size: calc(22 * var(--rpx));
}

.sell-rank__share {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  gap: calc(6 * var(--rpx));
  padding: 0;
}

.sell-rank__share-icon {
  font-size: calc(28 * var(--rpx));
  line-height: 1;
}

.sell-rank__share-text {
  font-size: calc(22 * var(--rpx));
}

.sell-rank__tabs-wrap {
  background: var(--rank-beige);
  border-radius: calc(16 * var(--rpx)) calc(16 * var(--rpx)) 0 0;
  display: flex;
  margin-top: calc(-2 * var(--rpx));
  overflow: hidden;
}

.sell-rank__tab {
  align-items: center;
  appearance: none;
  background: var(--rank-beige);
  border: none;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-height: calc(88 * var(--rpx));
  padding: calc(18 * var(--rpx)) calc(8 * var(--rpx)) calc(14 * var(--rpx));
  position: relative;
}

.sell-rank__tab--active {
  background: #fff;
  border-radius: calc(16 * var(--rpx)) calc(16 * var(--rpx)) 0 0;
}

.sell-rank__tab-text {
  color: var(--rank-brown);
  font-size: calc(28 * var(--rpx));
}

.sell-rank__tab--active .sell-rank__tab-text {
  color: #2c1a0d;
  font-weight: 700;
}

.sell-rank__tab-bar {
  background: var(--rank-brown);
  border-radius: 999px;
  bottom: 0;
  height: calc(6 * var(--rpx));
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: calc(56 * var(--rpx));
}

.sell-rank__toolbar {
  align-items: center;
  background: #fff;
  border-bottom: calc(1 * var(--rpx)) solid #ebe3d8;
  display: flex;
  gap: calc(12 * var(--rpx));
  padding: calc(16 * var(--rpx)) calc(20 * var(--rpx));
}

.sell-rank__period {
  align-items: center;
  appearance: none;
  background: #faf7f2;
  border: calc(1 * var(--rpx)) solid #e8dfd3;
  border-radius: calc(8 * var(--rpx));
  display: flex;
  flex-shrink: 0;
  gap: calc(4 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

.sell-rank__period-text {
  color: var(--text-main);
  font-size: calc(24 * var(--rpx));
}

.sell-rank__nav {
  align-items: center;
  background: #faf7f2;
  border: calc(1 * var(--rpx)) solid #e8dfd3;
  border-radius: calc(8 * var(--rpx));
  display: flex;
  flex: 1;
  min-width: 0;
}

.sell-rank__nav-btn {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  display: flex;
  flex: 0.88;
  flex-shrink: 0;
  justify-content: center;
  min-height: calc(64 * var(--rpx));
  padding: 0;
}

.sell-rank__nav-btn-text {
  color: var(--text-tips);
  font-size: calc(20 * var(--rpx));
  white-space: nowrap;
}

.sell-rank__nav-label {
  color: var(--text-main);
  flex: 1;
  font-size: calc(26 * var(--rpx));
  font-weight: 700;
  line-height: 1.2;
  min-width: 0;
  padding: 0 calc(4 * var(--rpx));
  text-align: center;
  white-space: nowrap;
}

.sell-rank__nav-label--compact {
  font-size: calc(22 * var(--rpx));
  font-weight: 600;
}

.sell-rank__table-head {
  align-items: center;
  background: #fff;
  display: flex;
  padding: calc(16 * var(--rpx)) calc(20 * var(--rpx)) calc(12 * var(--rpx));
}

.sell-rank__col {
  color: var(--text-tips);
  font-size: calc(22 * var(--rpx));
}

.sell-rank__col--name {
  flex: 1.35;
  min-width: 0;
}

.sell-rank__col--avg,
.sell-rank__col--total {
  flex: 0.85;
  text-align: center;
}

.sell-rank__col--metric {
  flex: 0.72;
  text-align: right;
}

.sell-rank__body {
  background: #fff;
  min-height: calc(360 * var(--rpx));
  overflow: hidden;
  position: relative;
}

.sell-rank__watermark {
  align-content: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: calc(48 * var(--rpx)) calc(24 * var(--rpx));
  inset: 0;
  opacity: 0.05;
  padding: calc(40 * var(--rpx)) calc(16 * var(--rpx));
  pointer-events: none;
  position: absolute;
  z-index: 0;
}

.sell-rank__watermark-text {
  color: var(--rank-brown);
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  transform: rotate(-18deg);
}

.sell-rank__state {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(320 * var(--rpx));
  position: relative;
  z-index: 1;
}

.sell-rank__spinner {
  animation: sell-rank-spin 0.8s linear infinite;
  border: calc(4 * var(--rpx)) solid #ebe3d8;
  border-radius: 50%;
  border-top-color: #9a6b2f;
  height: calc(48 * var(--rpx));
  width: calc(48 * var(--rpx));
}

@keyframes sell-rank-spin {
  to {
    transform: rotate(360deg);
  }
}

.sell-rank__state-text {
  color: var(--text-tips);
  font-size: calc(26 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
}

.sell-rank__list {
  position: relative;
  z-index: 1;
}

.sell-rank__row {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  border-bottom: calc(1 * var(--rpx)) solid #f0ebe4;
  display: flex;
  padding: calc(22 * var(--rpx)) calc(20 * var(--rpx));
  text-align: left;
  width: 100%;
}

.sell-rank__row-main {
  align-items: flex-start;
  display: flex;
  flex: 1.35;
  gap: calc(12 * var(--rpx));
  min-width: 0;
}

.sell-rank__badge {
  align-items: center;
  background: #d9dde3;
  border-radius: calc(8 * var(--rpx));
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  padding: calc(4 * var(--rpx)) 0 calc(6 * var(--rpx));
  width: calc(56 * var(--rpx));
}

.sell-rank__badge--1 {
  background: linear-gradient(180deg, #f5d278 0%, #d4a843 100%);
}

.sell-rank__badge--2 {
  background: linear-gradient(180deg, #d8e8ff 0%, #9ebce8 100%);
}

.sell-rank__badge--3 {
  background: linear-gradient(180deg, #f0c9a8 0%, #c8895a 100%);
}

.sell-rank__badge-top {
  color: rgba(0, 0, 0, 0.55);
  font-size: calc(14 * var(--rpx));
  font-weight: 700;
  line-height: 1.1;
}

.sell-rank__badge-num {
  color: rgba(0, 0, 0, 0.75);
  font-size: calc(24 * var(--rpx));
  font-weight: 700;
  line-height: 1.1;
}

.sell-rank__info {
  flex: 1;
  min-width: 0;
}

.sell-rank__name {
  color: var(--text-main);
  display: block;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sell-rank__area {
  color: var(--text-tips);
  display: block;
  font-size: calc(22 * var(--rpx));
  line-height: 1.3;
  margin-top: calc(6 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sell-rank__cell {
  color: var(--text-content);
  font-size: calc(24 * var(--rpx));
  line-height: 1.3;
}

.sell-rank__cell--avg,
.sell-rank__cell--total {
  flex: 0.85;
  text-align: center;
}

.sell-rank__cell--metric {
  color: var(--rank-red);
  flex: 0.72;
  font-size: calc(26 * var(--rpx));
  font-weight: 700;
  text-align: right;
}

.sell-rank__disclaimer {
  color: var(--text-tips);
  font-size: calc(22 * var(--rpx));
  line-height: 1.5;
  margin: 0;
  padding: calc(20 * var(--rpx)) calc(24 * var(--rpx)) 0;
}

.sell-rank__download {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  border-radius: calc(12 * var(--rpx));
  bottom: calc(48 * var(--rpx) + env(safe-area-inset-bottom));
  box-shadow: 0 calc(8 * var(--rpx)) calc(24 * var(--rpx)) rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: calc(4 * var(--rpx));
  height: calc(96 * var(--rpx));
  justify-content: center;
  padding: 0;
  position: fixed;
  right: calc(24 * var(--rpx));
  width: calc(96 * var(--rpx));
  z-index: 20;
}

.sell-rank__download-icon {
  color: var(--text-content);
  font-size: calc(34 * var(--rpx));
  line-height: 1;
}

.sell-rank__download-text {
  color: var(--text-content);
  font-size: calc(20 * var(--rpx));
}
</style>
