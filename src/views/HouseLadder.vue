<template>
  <div class="house-ladder">
    <img class="house-ladder__header-bg" :src="IMG.headerBg" alt="" />

    <div class="house-ladder__filter" :class="{ 'house-ladder__filter--open': showAreaPicker }">
      <div class="house-ladder__tabs">
        <button
          v-for="tab in levelTabs"
          :key="tab.value || 'all'"
          type="button"
          class="house-ladder__tab"
          :class="{ 'house-ladder__tab--active': level === tab.value }"
          @click="selectLevel(tab.value)"
        >
          <img
            class="house-ladder__tab-icon"
            :src="level === tab.value ? IMG.filterActive : IMG.filterNormal"
            alt=""
          />
          <span class="house-ladder__tab-text">{{ tab.label }}</span>
        </button>
      </div>
      <button type="button" class="house-ladder__area-btn" @click="showAreaPicker = true">
        <span class="house-ladder__area-text">{{ areaLabel }}</span>
        <span class="house-ladder__area-chevron" aria-hidden="true" />
      </button>
    </div>

    <div v-if="loading" class="house-ladder__state">
      <img class="house-ladder__loading-icon" :src="IMG.loading" alt="" />
      <span class="house-ladder__state-text">加载中</span>
    </div>

    <div v-else-if="list.length" class="house-ladder__list">
      <HouseLadderItem
        v-for="item in list"
        :key="item.houseTypeId ?? item.projectId"
        :item="item"
        @click="onItemTap"
        @preview-image="onPreviewImage"
      />
      <div v-if="loadingMore" class="house-ladder__state house-ladder__state--inline">
        <img class="house-ladder__loading-icon" :src="IMG.loading" alt="" />
        <span class="house-ladder__state-text">加载中</span>
      </div>
    </div>

    <div v-else class="house-ladder__state">
      <span class="house-ladder__state-text">暂无榜单数据</span>
    </div>

    <div class="house-ladder__floats">
      <button type="button" class="house-ladder__float-btn" aria-label="下载" @click="onDownload" />
      <button type="button" class="house-ladder__float-btn" aria-label="分享" @click="onShare" />
    </div>

    <div v-if="showAreaPicker" class="house-ladder__mask" @click="showAreaPicker = false">
      <div class="house-ladder__picker" @click.stop>
        <div class="house-ladder__picker-head">
          <span>选择区域/板块</span>
          <button type="button" class="house-ladder__picker-close" @click="showAreaPicker = false">关闭</button>
        </div>
        <div class="house-ladder__picker-body">
          <button type="button" class="house-ladder__district-all" @click="selectDistrict('全城')">全城</button>
          <div
            v-for="area in districts"
            :key="area.district"
            class="house-ladder__area-block"
          >
            <button type="button" class="house-ladder__area-title" @click="selectDistrict(area.district ?? '')">
              {{ area.district }}
            </button>
            <div v-if="area.plates?.length" class="house-ladder__plate-list">
              <button
                v-for="plate in area.plates"
                :key="`${area.district}-${plate}`"
                type="button"
                class="house-ladder__plate"
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
import { fetchHouseLadderRank } from "@/api/house-ladder-rank"
import HouseLadderItem from "@/components/house-ladder/HouseLadderItem.vue"
import { IMG, LEVEL_TABS } from "@/config/house-ladder-rank"
import type {
  HouseLadderDistrict,
  HouseLadderFilterTab,
  HouseLadderRankItem,
} from "@/types/house-ladder-rank"

const PAGE_SIZE = 10

const state = reactive({
  loading: false,
  loadingMore: false,
  list: [] as HouseLadderRankItem[],
  page: 1,
  hasMore: true,
  level: "",
  district: "",
  plate: "",
  areaLabel: "全城",
  showAreaPicker: false,
  filters: [] as HouseLadderFilterTab[],
  districts: [] as HouseLadderDistrict[],
})

const { loading, loadingMore, list, level, areaLabel, showAreaPicker, districts, filters } = toRefs(state)

const levelTabs = computed(() => {
  const tab = filters.value.find((item) => item.key === "level")
  if (tab?.children?.length) {
    return tab.children.map((child) => ({ value: child.value ?? "", label: child.title ?? "" }))
  }
  return LEVEL_TABS
})

async function loadPage(page: number, append: boolean) {
  if (append) {
    if (!state.hasMore || state.loadingMore) return
    state.loadingMore = true
  } else {
    state.loading = true
  }
  try {
    const res = await fetchHouseLadderRank({
      page,
      size: PAGE_SIZE,
      level: state.level || undefined,
      district: state.district || undefined,
      plate: state.plate || undefined,
    })
    state.list = append ? state.list.concat(res.items ?? []) : (res.items ?? [])
    state.hasMore = Boolean(res.hasMore)
    state.page = page
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

function selectLevel(next: string) {
  if (state.level === next) return
  state.level = next
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
  document.title = "户型天梯榜"
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

function onItemTap(_item: HouseLadderRankItem) {
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

function onDownload() {
  if (!list.value.length) {
    toast("暂无数据，不支持生成海报")
    return
  }
  toast("下载海报待接入")
}

function onShare() {
  toast("分享待接入")
}
</script>

<style scoped>
.house-ladder {
  --rpx: calc(100vw / 750);
  background: #241000;
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: calc(22 * var(--rpx) + env(safe-area-inset-bottom));
}

.house-ladder__header-bg {
  display: block;
  height: calc(358 * var(--rpx));
  width: 100%;
}

.house-ladder__filter {
  margin-top: calc(-8 * var(--rpx));
  padding: 0 calc(22 * var(--rpx));
}

.house-ladder__tabs {
  display: flex;
  gap: calc(8 * var(--rpx));
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(12 * var(--rpx));
}

.house-ladder__tab {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: #ffe4a8;
  display: inline-flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: calc(4 * var(--rpx));
  padding: 0 calc(8 * var(--rpx));
}

.house-ladder__tab--active .house-ladder__tab-text {
  color: #fff;
}

.house-ladder__tab-icon {
  height: calc(40 * var(--rpx));
  width: calc(40 * var(--rpx));
}

.house-ladder__tab-text {
  font-size: calc(24 * var(--rpx));
  line-height: calc(34 * var(--rpx));
}

.house-ladder__area-btn {
  align-items: center;
  appearance: none;
  background: rgba(255, 228, 168, 0.12);
  border: 1px solid rgba(255, 228, 168, 0.24);
  border-radius: calc(8 * var(--rpx));
  color: #ffe4a8;
  display: inline-flex;
  font-size: calc(24 * var(--rpx));
  gap: calc(8 * var(--rpx));
  margin-top: calc(8 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

.house-ladder__area-chevron {
  border-left: calc(5 * var(--rpx)) solid transparent;
  border-right: calc(5 * var(--rpx)) solid transparent;
  border-top: calc(6 * var(--rpx)) solid #ffe4a8;
  height: 0;
  width: 0;
}

.house-ladder__list {
  padding: calc(10 * var(--rpx)) calc(22 * var(--rpx)) 0;
}

.house-ladder__state {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(420 * var(--rpx));
}

.house-ladder__state--inline {
  min-height: calc(120 * var(--rpx));
}

.house-ladder__loading-icon {
  animation: house-ladder-spin 1.5s linear infinite;
  height: calc(40 * var(--rpx));
  width: calc(40 * var(--rpx));
}

.house-ladder__state-text {
  color: rgba(255, 228, 168, 0.45);
  font-size: calc(28 * var(--rpx));
  margin-top: calc(16 * var(--rpx));
}

.house-ladder__floats {
  background: url(https://imgcdn.huanjutang.com/internal/image/20250401/cvlknlethvut9cnb15j0.png)
    no-repeat center / 100% 100%;
  bottom: calc(102 * var(--rpx) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  height: calc(168 * var(--rpx));
  position: fixed;
  right: calc(32 * var(--rpx));
  width: calc(80 * var(--rpx));
  z-index: 5;
}

.house-ladder__float-btn {
  appearance: none;
  background: none;
  border: none;
  height: calc(84 * var(--rpx));
  padding: 0;
  width: calc(80 * var(--rpx));
}

.house-ladder__mask {
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 20;
}

.house-ladder__picker {
  background: #fff;
  border-radius: calc(24 * var(--rpx)) calc(24 * var(--rpx)) 0 0;
  max-height: 70vh;
  overflow: hidden;
  width: 100%;
}

.house-ladder__picker-head {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  font-size: calc(30 * var(--rpx));
  font-weight: 700;
  justify-content: space-between;
  padding: calc(24 * var(--rpx)) calc(32 * var(--rpx));
}

.house-ladder__picker-close {
  appearance: none;
  background: none;
  border: none;
  color: #2d8cf0;
  font-size: calc(28 * var(--rpx));
}

.house-ladder__picker-body {
  max-height: calc(70vh - calc(88 * var(--rpx)));
  overflow-y: auto;
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx)) calc(32 * var(--rpx));
}

.house-ladder__district-all {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  margin-bottom: calc(16 * var(--rpx));
  padding: 0;
}

.house-ladder__area-block + .house-ladder__area-block {
  margin-top: calc(24 * var(--rpx));
}

.house-ladder__area-title {
  appearance: none;
  background: none;
  border: none;
  color: #303133;
  font-size: calc(28 * var(--rpx));
  font-weight: 700;
  padding: 0;
}

.house-ladder__plate-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(12 * var(--rpx));
  margin-top: calc(12 * var(--rpx));
}

.house-ladder__plate {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  font-size: calc(24 * var(--rpx));
  padding: calc(10 * var(--rpx)) calc(16 * var(--rpx));
}

@keyframes house-ladder-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
