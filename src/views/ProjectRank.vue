<template>
  <div class="project-rank">
    <div class="project-rank__page">
      <div class="project-rank__tabs-wrap">
        <div ref="tabsRef" class="project-rank__tabs" role="tablist">
          <div class="project-rank__tabs-inner">
            <button
              v-for="(tab, index) in tabItems"
              :key="tab.key"
              type="button"
              class="project-rank__tab"
              :class="{ 'project-rank__tab--active': activeTab === tab.key }"
              role="tab"
              :aria-selected="activeTab === tab.key"
              @click="selectTab(tab.key, index)"
            >
              <span v-if="activeTab === tab.key" class="project-rank__tab-badge">
                <img class="project-rank__tab-badge-img" :src="IMG.tabActiveBadge" :alt="tab.label" />
                <span class="project-rank__tab-line" />
              </span>
              <span v-else class="project-rank__tab-text">{{ tab.label }}</span>
            </button>
            <span class="project-rank__tabs-spacer" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div class="project-rank__tip">
        <div class="project-rank__tip-left">
          <p class="project-rank__tip-top">{{ disclaimer }}</p>
          <div class="project-rank__tip-bottom">
            <span class="project-rank__updated">{{ updatedAt }}</span>
            <button type="button" class="project-rank__history" @click="onHistoryTap">
              往期榜单
              <span class="project-rank__history-arrow" aria-hidden="true" />
            </button>
          </div>
        </div>
        <button type="button" class="project-rank__district" @click="showAreaPicker = true">
          <span class="project-rank__district-text">{{ areaLabel }}</span>
          <img class="project-rank__district-arrow" :src="IMG.areaArrow" alt="" />
        </button>
      </div>

      <div class="project-rank__content">
        <ProjectRankList
          :rows="rows"
          :loading="loading"
          :loading-more="loadingMore"
          @project-tap="onProjectTap"
        />
      </div>

      <footer v-if="rows.length" class="project-rank__footer">
        <img class="project-rank__slogan" :src="IMG.slogan" alt="房小团" />
      </footer>
    </div>

    <div v-if="showAreaPicker" class="project-rank__mask" @click="showAreaPicker = false">
      <div class="project-rank__picker" @click.stop>
        <div class="project-rank__picker-head">
          <span>选择区域/板块</span>
          <button type="button" class="project-rank__picker-close" @click="showAreaPicker = false">关闭</button>
        </div>
        <div class="project-rank__picker-body">
          <button type="button" class="project-rank__district-all" @click="selectDistrict('全城')">全城</button>
          <div
            v-for="area in districts"
            :key="area.district"
            class="project-rank__area-block"
          >
            <button type="button" class="project-rank__area-title" @click="selectDistrict(area.district ?? '')">
              {{ area.district }}
            </button>
            <div v-if="area.plates?.length" class="project-rank__plate-list">
              <button
                v-for="plate in area.plates"
                :key="`${area.district}-${plate}`"
                type="button"
                class="project-rank__plate"
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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from "vue"
import { fetchProjectRank } from "@/api/project-rank"
import ProjectRankList from "@/components/project-rank/ProjectRankList.vue"
import { IMG, PAGE_SIZE, TAB_ITEMS } from "@/config/project-rank"
import type { ProjectRankDistrict, ProjectRankItem, ProjectRankTabKey } from "@/types/project-rank"

const tabsRef = ref<HTMLElement | null>(null)

const state = reactive({
  loading: false,
  loadingMore: false,
  activeTab: "popularity" as ProjectRankTabKey,
  district: "",
  plate: "",
  areaLabel: "全城",
  rows: [] as ProjectRankItem[],
  page: 1,
  hasMore: true,
  disclaimer: "来源平台的楼盘浏览量统计数据，仅供参考。",
  updatedAt: "",
  districts: [] as ProjectRankDistrict[],
  showAreaPicker: false,
})

const {
  loading,
  loadingMore,
  activeTab,
  areaLabel,
  rows,
  disclaimer,
  updatedAt,
  districts,
  showAreaPicker,
} = toRefs(state)

const tabItems = computed(() => TAB_ITEMS)

async function loadRows(reset = false) {
  if (reset) {
    state.page = 1
    state.hasMore = true
    state.rows = []
  }
  if (!state.hasMore && !reset) return

  const isFirstPage = state.page === 1
  if (isFirstPage) state.loading = true
  else state.loadingMore = true

  try {
    const data = await fetchProjectRank({
      page: state.page,
      size: PAGE_SIZE,
      tab: state.activeTab,
      district: state.district || undefined,
      plate: state.plate || undefined,
    })
    const items = data.items ?? []
    state.rows = reset ? items : [...state.rows, ...items]
    state.hasMore = Boolean(data.hasMore)
    state.disclaimer = data.disclaimer || state.disclaimer
    state.updatedAt = data.updatedAt || state.updatedAt
    if (data.districts?.length) state.districts = data.districts
    if (data.hasMore) state.page += 1
  } catch {
    if (reset) state.rows = []
    state.hasMore = false
  } finally {
    state.loading = false
    state.loadingMore = false
  }
}

function selectTab(tab: ProjectRankTabKey, index: number) {
  if (state.activeTab === tab) return
  state.activeTab = tab
  void loadRows(true)
  void nextTick(() => {
    const container = tabsRef.value
    const tabEl = container?.querySelectorAll(".project-rank__tab")[index]
    tabEl?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  })
}

function selectDistrict(district: string, plate?: string) {
  state.district = district === "全城" ? "" : district
  state.plate = plate || ""
  state.areaLabel = plate || district || "全城"
  state.showAreaPicker = false
  void loadRows(true)
}

function onScroll() {
  if (state.loading || state.loadingMore || !state.hasMore) return
  const threshold = 120
  const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold
  if (reachedBottom) void loadRows(false)
}

onMounted(() => {
  document.title = "楼盘排行榜"
  void loadRows(true)
  window.addEventListener("scroll", onScroll, { passive: true })
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

function onHistoryTap() {
  toast("往期榜单待接入")
}

function onProjectTap(_item: ProjectRankItem) {
  toast("楼盘详情请在小程序内打开")
}
</script>

<style scoped>
.project-rank {
  background: #e8effa url(https://imgcdn.huanjutang.com/image/2023/03/07/b2df9447bbc3bfa8fd6b8c5abd0022a0.png)
    0 0 / 100% 232px no-repeat;
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: 27px;
  position: relative;
  width: 100%;
}

.project-rank__page {
  font-family: -apple-system-font, "Helvetica Neue", Helvetica, sans-serif;
  min-height: calc(100vh - 82px);
  position: relative;
  width: 100%;
}

.project-rank__tabs-wrap {
  background: #e8effa url(https://imgcdn.huanjutang.com/image/2023/03/07/b2df9447bbc3bfa8fd6b8c5abd0022a0.png)
    0 0 / 100% 232px no-repeat;
  left: 0;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
}

.project-rank__tabs {
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  height: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;
  scrollbar-width: none;
  white-space: nowrap;
  width: 100%;
}

.project-rank__tabs::-webkit-scrollbar {
  display: none;
}

.project-rank__tabs-inner {
  display: inline-flex;
  flex-wrap: nowrap;
  height: 52px;
  min-width: 100%;
}

.project-rank__tab {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: rgb(255 255 255 / 85%);
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 17px;
  justify-content: center;
  padding: 0 0 0 15px;
}

.project-rank__tab:first-child {
  padding-left: 0;
}

.project-rank__tab-text {
  line-height: 52px;
}

.project-rank__tab-badge {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.project-rank__tab-badge-img {
  height: 39px;
  margin-top: 4px;
  width: auto;
}

.project-rank__tab-line {
  background: #ffeda5;
  border-radius: 2px;
  display: inline-block;
  height: 4px;
  margin-top: 3px;
  width: 35px;
}

.project-rank__tabs-spacer {
  display: inline-block;
  flex-shrink: 0;
  height: 52px;
  width: 15px;
}

.project-rank__tip {
  align-items: center;
  box-sizing: border-box;
  color: rgb(255 255 255 / 65%);
  display: flex;
  font-size: 11px;
  justify-content: space-between;
  line-height: 17px;
  padding: 7px 17px 0;
}

.project-rank__tip-left {
  flex: 1;
  min-width: 0;
}

.project-rank__tip-top {
  margin: 0;
}

.project-rank__tip-bottom {
  align-items: center;
  display: flex;
  line-height: 1;
  padding-top: 4px;
}

.project-rank__updated {
  color: rgb(255 255 255 / 65%);
  font-size: 13px;
}

.project-rank__history {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  margin-left: 6px;
  padding: 0;
}

.project-rank__history-arrow {
  background: url(https://imgcdn.huanjutang.com/image/2023/05/17/942f7a94d65c90d02ca6ba047547b4d5.png)
    no-repeat 0 0 / 100% 100%;
  display: inline-block;
  height: 11px;
  margin-left: 2px;
  width: 9px;
}

.project-rank__district {
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 22px;
  justify-content: center;
  margin-left: 12px;
  padding: 0;
}

.project-rank__district-text {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
}

.project-rank__district-arrow {
  height: 15px;
  margin-left: 6px;
  width: 15px;
}

.project-rank__content {
  overflow: hidden;
  padding-top: 6px;
}

.project-rank__footer {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
}

.project-rank__slogan {
  height: 37px;
  width: auto;
}

.project-rank__mask {
  background: rgb(0 0 0 / 45%);
  inset: 0;
  position: fixed;
  z-index: 100;
}

.project-rank__picker {
  background: #fff;
  border-radius: 12px 12px 0 0;
  bottom: 0;
  left: 0;
  max-height: 70vh;
  overflow: hidden;
  position: fixed;
  right: 0;
  z-index: 101;
}

.project-rank__picker-head {
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  padding: 14px 16px;
}

.project-rank__picker-close {
  appearance: none;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.project-rank__picker-body {
  max-height: calc(70vh - 52px);
  overflow-y: auto;
  padding: 12px 16px 24px;
}

.project-rank__district-all,
.project-rank__area-title,
.project-rank__plate {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  margin: 0 8px 8px 0;
  padding: 8px 12px;
}

.project-rank__area-block {
  margin-top: 8px;
}

.project-rank__area-title {
  background: #e8effa;
  font-weight: 700;
}

.project-rank__plate-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
}
</style>
