<template>
  <div class="new-house-price">
    <header class="new-house-price__header">
      <p class="new-house-price__updated">更新截止：{{ updateTime || "-" }}</p>
    </header>

    <div v-if="loading" class="new-house-price__loading">
      <img class="new-house-price__loading-icon" :src="IMG.loading" alt="" />
      <span class="new-house-price__loading-text">加载中</span>
    </div>

    <PriceGraph
      v-else-if="list.length"
      :items="list"
      @project-tap="onProjectTap"
    />

    <div v-else class="new-house-price__empty">
      <span class="new-house-price__empty-text">暂无榜单数据</span>
    </div>

    <footer class="new-house-price__footer">
      <div v-if="dateList.length > 1" class="new-house-price__slider-row">
        <span class="new-house-price__year">{{ firstYear }}</span>
        <div class="new-house-price__slider-wrap">
          <input
            class="new-house-price__slider"
            type="range"
            min="0"
            :max="Math.max(dateList.length - 1, 0)"
            :value="sliderValue"
            @input="onRangeInput"
            @mousedown="isScale = true"
            @mouseup="isScale = false"
            @touchstart="isScale = true"
            @touchend="isScale = false"
          />
          <div
            class="new-house-price__slider-thumb"
            :class="{ 'new-house-price__slider-thumb--active': isScale }"
            :style="sliderThumbStyle"
          >
            <span class="new-house-price__slider-date">{{ sliderText }}</span>
          </div>
        </div>
        <span class="new-house-price__year">{{ lastYear }}</span>
      </div>

      <div class="new-house-price__toolbar">
        <div class="new-house-price__toolbar-left">
          <button
            type="button"
            class="new-house-price__play"
            :disabled="dateList.length <= 1"
            @click="togglePlay"
          >
            <img :src="isPlay ? IMG.pause : IMG.play" alt="" />
          </button>
          <button
            type="button"
            class="new-house-price__quarter"
            :class="{ 'new-house-price__quarter--disabled': !canPrevQuarter }"
            @click="prevQuarter"
          >
            <span class="new-house-price__quarter-bg" />
            <span class="new-house-price__quarter-text">上个季度</span>
          </button>
          <button
            type="button"
            class="new-house-price__quarter"
            :class="{ 'new-house-price__quarter--disabled': !canNextQuarter }"
            @click="nextQuarter"
          >
            <span class="new-house-price__quarter-bg" />
            <span class="new-house-price__quarter-text">下个季度</span>
          </button>
        </div>
        <button type="button" class="new-house-price__filter" @click="showAreaPicker = true">
          <span class="new-house-price__quarter-bg" />
          <span class="new-house-price__filter-text">{{ areaLabel }}</span>
          <img class="new-house-price__filter-icon" :src="IMG.filterArrow" alt="" />
        </button>
      </div>
    </footer>

    <div class="new-house-price__floats">
      <button type="button" class="new-house-price__float-btn" aria-label="下载" @click="onDownload" />
      <button type="button" class="new-house-price__float-btn" aria-label="分享" @click="onShare" />
    </div>

    <div v-if="showAreaPicker" class="new-house-price__mask" @click="showAreaPicker = false">
      <div class="new-house-price__picker" @click.stop>
        <div class="new-house-price__picker-head">
          <span>选择区域/板块</span>
          <button type="button" class="new-house-price__picker-close" @click="showAreaPicker = false">关闭</button>
        </div>
        <div class="new-house-price__picker-body">
          <div
            v-for="area in areas"
            :key="area.areaid"
            class="new-house-price__area-block"
          >
            <button
              type="button"
              class="new-house-price__area-title"
              @click="selectArea(area)"
            >
              {{ area.area }}
            </button>
            <div v-if="area.plates?.length" class="new-house-price__plate-list">
              <button
                v-for="plate in area.plates"
                :key="`${area.areaid}-${plate.id}`"
                type="button"
                class="new-house-price__plate"
                @click="selectArea(area, plate.name)"
              >
                {{ plate.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, toRefs } from "vue"
import { fetchNewHousePriceRank } from "@/api/new-house-price-rank"
import PriceGraph from "@/components/new-house-price/PriceGraph.vue"
import { IMG } from "@/config/new-house-price-rank"
import type {
  NewHousePriceRankArea,
  NewHousePriceRankItem,
  NewHousePriceRankSnapshot,
} from "@/types/new-house-price-rank"

const state = reactive({
  loading: false,
  updateTime: "",
  dateList: [] as NewHousePriceRankSnapshot[],
  areas: [] as NewHousePriceRankArea[],
  sliderValue: 0,
  isScale: false,
  isPlay: false,
  district: "",
  plate: "",
  areaLabel: "全城",
  showAreaPicker: false,
})

const { loading, updateTime, dateList, areas, sliderValue, isScale, isPlay, areaLabel, showAreaPicker } =
  toRefs(state)

let playTimer: ReturnType<typeof setInterval> | null = null

const list = computed(() => dateList.value[sliderValue.value]?.list ?? [])

const sliderText = computed(() => dateList.value[sliderValue.value]?.date ?? dateList.value[0]?.date ?? "")

const firstYear = computed(() => dateList.value[0]?.date?.split(".")[0] ?? "")

const lastYear = computed(() => {
  const last = dateList.value[dateList.value.length - 1]
  return last?.date?.split(".")[0] ?? ""
})

const canPrevQuarter = computed(() => sliderValue.value > 0)
const canNextQuarter = computed(() => sliderValue.value < dateList.value.length - 1)

const sliderThumbStyle = computed(() => {
  const max = Math.max(dateList.value.length - 1, 1)
  return { left: `${(sliderValue.value / max) * 100}%` }
})

function stopPlay() {
  state.isPlay = false
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

function applySnapshotIndex(index: number) {
  const max = Math.max(state.dateList.length - 1, 0)
  state.sliderValue = Math.min(Math.max(index, 0), max)
}

function onSliderInput(value: number) {
  stopPlay()
  applySnapshotIndex(value)
}

function prevQuarter() {
  stopPlay()
  if (!canPrevQuarter.value) return
  applySnapshotIndex(state.sliderValue - 1)
}

function nextQuarter() {
  stopPlay()
  if (!canNextQuarter.value) return
  applySnapshotIndex(state.sliderValue + 1)
}

function togglePlay() {
  if (state.dateList.length <= 1) return
  state.isPlay = !state.isPlay
  if (!state.isPlay) {
    stopPlay()
    return
  }
  if (state.sliderValue >= state.dateList.length - 1) applySnapshotIndex(0)
  playTimer = setInterval(() => {
    if (state.sliderValue >= state.dateList.length - 1) {
      stopPlay()
      return
    }
    applySnapshotIndex(state.sliderValue + 1)
  }, 3000)
}

async function loadRank() {
  state.loading = true
  try {
    const res = await fetchNewHousePriceRank({
      district: state.district || undefined,
      plate: state.plate || undefined,
    })
    state.updateTime = res.updateTime ?? ""
    state.dateList = res.data ?? []
    state.areas = res.areas ?? []
    applySnapshotIndex(state.dateList.length - 1)
  } catch {
    state.dateList = []
    state.updateTime = ""
  } finally {
    state.loading = false
  }
}

function selectArea(area: NewHousePriceRankArea, plateName?: string) {
  stopPlay()
  if (area.area === "全城" || area.areaid === "-1") {
    state.district = ""
    state.plate = ""
    state.areaLabel = "全城"
  } else if (!plateName || plateName === "不限") {
    state.district = area.area ?? ""
    state.plate = ""
    state.areaLabel = area.area ?? "全城"
  } else {
    state.district = area.area ?? ""
    state.plate = plateName
    state.areaLabel = `${area.area}/${plateName}`
  }
  state.showAreaPicker = false
  void loadRank()
}

onMounted(() => {
  document.title = "新房价格风云榜"
  void loadRank()
})

onBeforeUnmount(stopPlay)

function onRangeInput(event: Event) {
  const target = event.target as HTMLInputElement
  onSliderInput(Number(target.value))
}

function toast(title: string) {
  const uni = (window as Window & { uni?: { showToast?: (o: { title: string; icon: string }) => void } }).uni
  if (uni?.showToast) {
    uni.showToast({ title, icon: "none" })
    return
  }
  window.alert(title)
}

function onProjectTap(_item: NewHousePriceRankItem) {
  toast("楼盘详情请在小程序内打开")
}

function onDownload() {
  toast("下载海报待接入")
}

function onShare() {
  toast("分享待接入")
}
</script>

<style scoped>
.new-house-price {
  --rpx: calc(100vw / 750);
  background: #1a1a28;
  box-sizing: border-box;
  min-height: 100vh;
  position: relative;
}

.new-house-price__header {
  background: url(https://imgcdn.huanjutang.com/internal/image/20250401/cvlqsrkjq74v8vt54k3g.png)
    no-repeat top / 100% 100%;
  height: calc(292 * var(--rpx));
  width: 100%;
}

.new-house-price__updated {
  color: #e3c499;
  font-size: calc(24 * var(--rpx));
  letter-spacing: calc(2 * var(--rpx));
  line-height: calc(34 * var(--rpx));
  margin: 0;
  padding-top: calc(190 * var(--rpx));
  text-align: center;
  text-shadow: 0 calc(6 * var(--rpx)) calc(12 * var(--rpx)) rgba(0, 74, 181, 0.24);
}

.new-house-price__loading,
.new-house-price__empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(420 * var(--rpx));
}

.new-house-price__loading-icon {
  animation: new-house-price-spin 1.5s linear infinite;
  height: calc(40 * var(--rpx));
  width: calc(40 * var(--rpx));
}

.new-house-price__loading-text {
  color: #999;
  font-size: calc(30 * var(--rpx));
  margin-top: calc(12 * var(--rpx));
}

.new-house-price__empty-text {
  color: #5a669b;
  font-size: calc(28 * var(--rpx));
  margin-top: calc(106 * var(--rpx));
}

.new-house-price__footer {
  background: url(https://imgcdn.huanjutang.com/internal/image/20250325/cvh6o6sjq74v8vsndud0.png)
    no-repeat top / 100% 100%;
  bottom: 0;
  height: calc(226 * var(--rpx));
  left: 0;
  position: fixed;
  width: 100%;
  z-index: 10;
}

.new-house-price__slider-row {
  align-items: center;
  display: flex;
  padding: calc(18 * var(--rpx)) calc(32 * var(--rpx)) calc(14 * var(--rpx));
}

.new-house-price__year {
  color: #b0bce9;
  font-size: calc(24 * var(--rpx));
  line-height: calc(28 * var(--rpx));
  white-space: nowrap;
}

.new-house-price__slider-wrap {
  flex: 1;
  margin: 0 calc(24 * var(--rpx));
  position: relative;
}

.new-house-price__slider {
  -webkit-appearance: none;
  appearance: none;
  background: #3d476f;
  border-radius: calc(4 * var(--rpx));
  height: calc(8 * var(--rpx));
  width: 100%;
}

.new-house-price__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  height: calc(96 * var(--rpx));
  width: calc(176 * var(--rpx));
}

.new-house-price__slider-thumb {
  background: url(https://imgcdn.huanjutang.com/internal/image/20250407/cvpjbjqr0v8iionk5vjg.png)
    no-repeat top / 100% 100%;
  height: calc(96 * var(--rpx));
  pointer-events: none;
  position: absolute;
  top: calc(-68 * var(--rpx));
  transform: translateX(-50%);
  width: calc(176 * var(--rpx));
}

.new-house-price__slider-thumb--active {
  background-image: url(https://imgcdn.huanjutang.com/internal/image/20250407/cvpikg9g0aituupqrdlg.png);
  height: calc(136 * var(--rpx));
  top: calc(-106 * var(--rpx));
  width: calc(264 * var(--rpx));
}

.new-house-price__slider-date {
  color: rgba(0, 0, 0, 0.85);
  font-size: calc(22 * var(--rpx));
  font-weight: 600;
  left: 50%;
  line-height: calc(22 * var(--rpx));
  position: absolute;
  top: calc(14 * var(--rpx));
  transform: translateX(-50%);
  white-space: nowrap;
}

.new-house-price__slider-thumb--active .new-house-price__slider-date {
  color: #2d8cf0;
  font-size: calc(32 * var(--rpx));
  line-height: calc(44 * var(--rpx));
  top: calc(16 * var(--rpx));
}

.new-house-price__toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 calc(32 * var(--rpx)) 0 calc(22 * var(--rpx));
}

.new-house-price__toolbar-left {
  align-items: center;
  display: flex;
}

.new-house-price__play {
  appearance: none;
  background: none;
  border: none;
  height: calc(108 * var(--rpx));
  margin-right: calc(14 * var(--rpx));
  padding: 0;
  width: calc(108 * var(--rpx));
}

.new-house-price__play:disabled {
  opacity: 0.45;
}

.new-house-price__play img {
  display: block;
  height: 100%;
  width: 100%;
}

.new-house-price__quarter,
.new-house-price__filter {
  align-items: center;
  appearance: none;
  background: linear-gradient(45deg, #a9927d, #93808a 20%, #7f645c 41%, #f4e4d8 72%, #bf9d7f);
  border: none;
  border-radius: calc(40 * var(--rpx));
  display: inline-flex;
  height: calc(64 * var(--rpx));
  padding: 0 calc(26 * var(--rpx));
  position: relative;
}

.new-house-price__quarter {
  margin-right: calc(24 * var(--rpx));
}

.new-house-price__quarter--disabled {
  opacity: 0.45;
}

.new-house-price__quarter-bg {
  background: linear-gradient(180deg, #2f334e, #222438);
  border-radius: calc(40 * var(--rpx));
  height: calc(100% - calc(4 * var(--rpx)));
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - calc(4 * var(--rpx)));
  z-index: 1;
}

.new-house-price__quarter-text,
.new-house-price__filter-text {
  color: #e8ceab;
  font-size: calc(26 * var(--rpx));
  font-weight: 600;
  position: relative;
  white-space: nowrap;
  z-index: 2;
}

.new-house-price__filter-text {
  line-height: calc(28 * var(--rpx));
  max-width: calc(156 * var(--rpx));
  overflow: hidden;
  text-overflow: ellipsis;
}

.new-house-price__filter-icon {
  height: calc(20 * var(--rpx));
  margin-left: calc(6 * var(--rpx));
  position: relative;
  width: calc(20 * var(--rpx));
  z-index: 2;
}

.new-house-price__floats {
  background: url(https://imgcdn.huanjutang.com/internal/image/20250326/cvhqqqcjq74v8vsnvvr0.png)
    no-repeat top / calc(80 * var(--rpx)) calc(170 * var(--rpx));
  bottom: calc(236 * var(--rpx) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  height: calc(170 * var(--rpx));
  position: fixed;
  right: calc(32 * var(--rpx));
  width: calc(80 * var(--rpx));
  z-index: 11;
}

.new-house-price__float-btn {
  appearance: none;
  background: none;
  border: none;
  height: calc(80 * var(--rpx));
  padding: 0;
  width: calc(80 * var(--rpx));
}

.new-house-price__mask {
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 20;
}

.new-house-price__picker {
  background: #fff;
  border-radius: calc(24 * var(--rpx)) calc(24 * var(--rpx)) 0 0;
  max-height: 70vh;
  overflow: hidden;
  width: 100%;
}

.new-house-price__picker-head {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  font-size: calc(30 * var(--rpx));
  font-weight: 700;
  justify-content: space-between;
  padding: calc(24 * var(--rpx)) calc(32 * var(--rpx));
}

.new-house-price__picker-close {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(28 * var(--rpx));
}

.new-house-price__picker-body {
  max-height: calc(70vh - calc(88 * var(--rpx)));
  overflow-y: auto;
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx)) calc(32 * var(--rpx));
}

.new-house-price__area-block + .new-house-price__area-block {
  margin-top: calc(24 * var(--rpx));
}

.new-house-price__area-title {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  padding: 0;
}

.new-house-price__plate-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(12 * var(--rpx));
  margin-top: calc(12 * var(--rpx));
}

.new-house-price__plate {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  font-size: calc(24 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

@keyframes new-house-price-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
