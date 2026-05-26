<template>
  <div class="house-type-popularity">
    <header class="house-type-popularity__header">
      <p class="house-type-popularity__disclaimer">{{ disclaimer }}</p>
    </header>

    <div class="house-type-popularity__tabs-wrap">
      <div class="house-type-popularity__tabs">
        <button
          v-for="tab in roomTabs"
          :key="tab.value || 'all'"
          type="button"
          class="house-type-popularity__tab"
          :class="{ 'house-type-popularity__tab--active': room === tab.value }"
          @click="selectRoom(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
      <button type="button" class="house-type-popularity__area-btn" @click="showAreaPicker = true">
        <span class="house-type-popularity__area-text">{{ areaLabel }}</span>
        <img class="house-type-popularity__area-arrow" :src="IMG.areaArrow" alt="" />
      </button>
    </div>

    <div v-if="loading" class="house-type-popularity__state">
      <img class="house-type-popularity__loading-icon" :src="IMG.loading" alt="" />
      <span class="house-type-popularity__state-text">加载中</span>
    </div>

    <div v-else-if="list.length" class="house-type-popularity__list">
      <HouseTypePopularityItem
        v-for="item in list"
        :key="item.houseTypeId ?? item.rank"
        :item="item"
        @click="onItemTap"
        @preview-image="onPreviewImage"
      />
      <div v-if="loadingMore" class="house-type-popularity__state house-type-popularity__state--inline">
        <img class="house-type-popularity__loading-icon" :src="IMG.loading" alt="" />
        <span class="house-type-popularity__state-text">加载中</span>
      </div>
    </div>

    <div v-else class="house-type-popularity__state">
      <span class="house-type-popularity__state-text">暂无榜单数据</span>
    </div>

    <footer class="house-type-popularity__footer">
      <div class="house-type-popularity__feedback">
        <img class="house-type-popularity__feedback-icon" :src="IMG.feedbackIcon" alt="" />
        <span class="house-type-popularity__feedback-text">户型信息有误？</span>
        <button type="button" class="house-type-popularity__feedback-link" @click="onFeedback">信息纠错</button>
        <span class="house-type-popularity__feedback-text">或</span>
        <button type="button" class="house-type-popularity__feedback-link" @click="onFeedback">意见反馈</button>
      </div>
      <img class="house-type-popularity__slogan" :src="IMG.slogan" alt="房小团" />
    </footer>

    <div v-if="showAreaPicker" class="house-type-popularity__mask" @click="showAreaPicker = false">
      <div class="house-type-popularity__picker" @click.stop>
        <div class="house-type-popularity__picker-head">
          <span>选择区域/板块</span>
          <button type="button" class="house-type-popularity__picker-close" @click="showAreaPicker = false">关闭</button>
        </div>
        <div class="house-type-popularity__picker-body">
          <button type="button" class="house-type-popularity__district-all" @click="selectDistrict('全城')">全城</button>
          <div
            v-for="area in districts"
            :key="area.district"
            class="house-type-popularity__area-block"
          >
            <button type="button" class="house-type-popularity__area-title" @click="selectDistrict(area.district ?? '')">
              {{ area.district }}
            </button>
            <div v-if="area.plates?.length" class="house-type-popularity__plate-list">
              <button
                v-for="plate in area.plates"
                :key="`${area.district}-${plate}`"
                type="button"
                class="house-type-popularity__plate"
                @click="selectDistrict(area.district ?? '', plate)"
              >
                {{ plate }}
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
import { fetchHouseTypePopularityRank } from "@/api/house-type-popularity-rank"
import HouseTypePopularityItem from "@/components/house-type-popularity/HouseTypePopularityItem.vue"
import { IMG, ROOM_TABS } from "@/config/house-type-popularity-rank"
import type {
  HouseTypePopularityDistrict,
  HouseTypePopularityFilterTab,
  HouseTypePopularityRankItem,
} from "@/types/house-type-popularity-rank"

const PAGE_SIZE = 10

const state = reactive({
  loading: false,
  loadingMore: false,
  list: [] as HouseTypePopularityRankItem[],
  page: 1,
  hasMore: true,
  room: "",
  district: "",
  plate: "",
  areaLabel: "全城",
  disclaimer: "来源平台的户型测评浏览量统计数据，仅供参考。",
  showAreaPicker: false,
  filters: [] as HouseTypePopularityFilterTab[],
  districts: [] as HouseTypePopularityDistrict[],
})

const { loading, loadingMore, list, room, areaLabel, disclaimer, showAreaPicker, districts, filters } =
  toRefs(state)

const roomTabs = computed(() => {
  const tab = filters.value.find((item) => item.key === "room")
  if (tab?.children?.length) {
    return tab.children.map((child) => ({ value: child.value ?? "", label: child.title ?? "" }))
  }
  return ROOM_TABS
})

async function loadPage(page: number, append: boolean) {
  if (append) {
    if (!state.hasMore || state.loadingMore) return
    state.loadingMore = true
  } else {
    state.loading = true
  }
  try {
    const res = await fetchHouseTypePopularityRank({
      page,
      size: PAGE_SIZE,
      room: state.room || undefined,
      district: state.district || undefined,
      plate: state.plate || undefined,
    })
    state.list = append ? state.list.concat(res.items ?? []) : (res.items ?? [])
    state.hasMore = Boolean(res.hasMore)
    state.page = page
    if (res.disclaimer) state.disclaimer = res.disclaimer
    if (!append) {
      state.filters = res.filters ?? []
      state.districts = res.districts ?? []
    }
  } catch {
    if (!append) {
      state.list = []
      state.filters = []
      state.districts = []
    }
    state.hasMore = false
  } finally {
    state.loading = false
    state.loadingMore = false
  }
}

function reload() {
  state.page = 1
  state.hasMore = true
  void loadPage(1, false)
}

function loadMore() {
  if (!state.hasMore || state.loading || state.loadingMore) return
  void loadPage(state.page + 1, true)
}

function selectRoom(next: string) {
  if (state.room === next) return
  state.room = next
  reload()
}

function selectDistrict(district: string, plate?: string) {
  if (!district || district === "全城") {
    state.district = ""
    state.plate = ""
    state.areaLabel = "全城"
  } else if (!plate || plate === "不限") {
    state.district = district
    state.plate = ""
    state.areaLabel = district
  } else {
    state.district = district
    state.plate = plate
    state.areaLabel = `${district}/${plate}`
  }
  state.showAreaPicker = false
  reload()
}

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
    loadMore()
  }
}

onMounted(() => {
  document.title = "户型人气榜"
  window.addEventListener("scroll", onScroll, { passive: true })
  void reload()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

function toast(title: string) {
  const uni = (window as Window & { uni?: { showToast?: (o: { title: string; icon: string }) => void } }).uni
  if (uni?.showToast) {
    uni.showToast({ title, icon: "none" })
    return
  }
  window.alert(title)
}

function onItemTap(_item: HouseTypePopularityRankItem) {
  toast("户型详情请在小程序内打开")
}

function onPreviewImage(url: string) {
  const w = window as Window & {
    uni?: { previewImage?: (o: { urls: string[] }) => void }
  }
  if (typeof w.uni?.previewImage === "function") {
    w.uni.previewImage({ urls: [url] })
    return
  }
  window.open(url, "_blank")
}

function onFeedback() {
  toast("反馈功能请在小程序内打开")
}
</script>

<style scoped>
.house-type-popularity {
  --rpx: calc(100vw / 750);
  background: #e8effa;
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: calc(220 * var(--rpx) + env(safe-area-inset-bottom));
}

.house-type-popularity__header {
  background: url(https://imgcdn.huanjutang.com/image/2024/04/07/49d02606b25763fd2afb30fb8b5cf263.png)
    no-repeat top / 100% 100%;
  box-sizing: border-box;
  height: calc(308 * var(--rpx));
  padding-top: calc(196 * var(--rpx));
}

.house-type-popularity__disclaimer {
  color: rgb(255 255 255 / 85%);
  font-size: calc(26 * var(--rpx));
  line-height: calc(36 * var(--rpx));
  margin: 0;
  text-align: center;
}

.house-type-popularity__tabs-wrap {
  background: #e8effa;
  padding: 0 calc(42 * var(--rpx)) calc(10 * var(--rpx));
}

.house-type-popularity__tabs {
  -webkit-overflow-scrolling: touch;
  display: flex;
  gap: calc(16 * var(--rpx));
  overflow-x: auto;
  padding: calc(8 * var(--rpx)) 0 calc(16 * var(--rpx));
  scrollbar-width: none;
}

.house-type-popularity__tabs::-webkit-scrollbar {
  display: none;
}

.house-type-popularity__tab {
  appearance: none;
  background: rgb(255 255 255 / 65%);
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: rgb(0 0 0 / 65%);
  flex-shrink: 0;
  font-size: calc(26 * var(--rpx));
  line-height: calc(56 * var(--rpx));
  min-width: calc(108 * var(--rpx));
  padding: 0 calc(24 * var(--rpx));
}

.house-type-popularity__tab--active {
  background: #2576f3;
  color: #fff;
  font-weight: 700;
}

.house-type-popularity__area-btn {
  align-items: center;
  appearance: none;
  background: #fff;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: rgb(0 0 0 / 85%);
  display: inline-flex;
  font-size: calc(26 * var(--rpx));
  gap: calc(8 * var(--rpx));
  padding: calc(14 * var(--rpx)) calc(20 * var(--rpx));
}

.house-type-popularity__area-arrow {
  height: calc(16 * var(--rpx));
  width: calc(16 * var(--rpx));
}

.house-type-popularity__list {
  padding: 0 calc(42 * var(--rpx));
}

.house-type-popularity__state {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(420 * var(--rpx));
}

.house-type-popularity__state--inline {
  min-height: calc(120 * var(--rpx));
}

.house-type-popularity__loading-icon {
  animation: house-type-popularity-spin 1.5s linear infinite;
  height: calc(40 * var(--rpx));
  width: calc(40 * var(--rpx));
}

.house-type-popularity__state-text {
  color: #828caa;
  font-size: calc(28 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
}

.house-type-popularity__footer {
  margin-top: calc(24 * var(--rpx));
  padding: 0 calc(42 * var(--rpx)) calc(32 * var(--rpx));
}

.house-type-popularity__feedback {
  align-items: center;
  color: #96989e;
  display: flex;
  flex-wrap: wrap;
  font-size: calc(24 * var(--rpx));
  gap: calc(8 * var(--rpx));
  justify-content: center;
  line-height: calc(34 * var(--rpx));
}

.house-type-popularity__feedback-icon {
  height: calc(24 * var(--rpx));
  width: calc(24 * var(--rpx));
}

.house-type-popularity__feedback-link {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(24 * var(--rpx));
  padding: 0;
}

.house-type-popularity__slogan {
  display: block;
  margin: calc(40 * var(--rpx)) auto 0;
  width: calc(348 * var(--rpx));
}

.house-type-popularity__mask {
  align-items: flex-end;
  background: rgb(0 0 0 / 45%);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 20;
}

.house-type-popularity__picker {
  background: #fff;
  border-radius: calc(24 * var(--rpx)) calc(24 * var(--rpx)) 0 0;
  max-height: 70vh;
  overflow: hidden;
  width: 100%;
}

.house-type-popularity__picker-head {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  font-size: calc(30 * var(--rpx));
  font-weight: 700;
  justify-content: space-between;
  padding: calc(24 * var(--rpx)) calc(32 * var(--rpx));
}

.house-type-popularity__picker-close {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(28 * var(--rpx));
}

.house-type-popularity__picker-body {
  max-height: calc(70vh - calc(88 * var(--rpx)));
  overflow-y: auto;
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx)) calc(32 * var(--rpx));
}

.house-type-popularity__district-all {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  margin-bottom: calc(16 * var(--rpx));
  padding: 0;
}

.house-type-popularity__area-block + .house-type-popularity__area-block {
  margin-top: calc(24 * var(--rpx));
}

.house-type-popularity__area-title {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  padding: 0;
}

.house-type-popularity__plate-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(12 * var(--rpx));
  margin-top: calc(12 * var(--rpx));
}

.house-type-popularity__plate {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  font-size: calc(24 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

@keyframes house-type-popularity-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
