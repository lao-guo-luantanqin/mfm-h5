<template>
  <div class="project-rank">
    <header class="project-rank__nav">
      <button type="button" class="project-rank__back" @click="onBack">‹</button>
      <h1 class="project-rank__title">楼盘排行榜</h1>
    </header>
    <ul class="project-rank__list">
      <li v-for="item in items" :key="item.id" class="project-rank__card">
        <span class="project-rank__badge">{{ item.rankLabel }}</span>
        <img class="project-rank__cover" :src="item.coverUrl" alt="" />
        <div class="project-rank__body">
          <strong>{{ item.name }}</strong>
          <p>{{ item.priceText }}</p>
          <p class="project-rank__meta">{{ item.areaLine }}</p>
        </div>
      </li>
    </ul>
    <p class="project-rank__hint">演示数据；正式环境接 mfm-api 楼盘榜单接口。</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const demoCover = "https://imgcdn.huanjutang.com/internal/image/20250901/d2qkcigqo4f4k9kirbo0.jpg"

const items = ref([
  {
    id: "r1",
    name: "示例榜单盘 · 壹号",
    priceText: "均价 3.4万/㎡",
    coverUrl: demoCover,
    rankLabel: "冠",
    areaLine: "示例区 · 滨江 · 105-165㎡",
  },
])

function onBack() {
  const uni = (window as Window & { uni?: { navigateBack?: () => void } }).uni
  if (uni?.navigateBack) {
    uni.navigateBack()
    return
  }
  router.back()
}
</script>

<style scoped>
.project-rank {
  background: #f7f7f7;
  min-height: 100vh;
}

.project-rank__nav {
  align-items: center;
  display: flex;
  padding: env(safe-area-inset-top) 8px 12px;
}

.project-rank__back {
  background: none;
  border: none;
  font-size: 28px;
}

.project-rank__title {
  flex: 1;
  font-size: 17px;
  margin: 0;
  text-align: center;
}

.project-rank__list {
  list-style: none;
  margin: 0;
  padding: 12px;
}

.project-rank__card {
  background: #fff;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  position: relative;
}

.project-rank__badge {
  background: #e03810;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  left: 8px;
  padding: 2px 6px;
  position: absolute;
  top: 8px;
  z-index: 1;
}

.project-rank__cover {
  border-radius: 6px;
  height: 72px;
  object-fit: cover;
  width: 96px;
}

.project-rank__body p {
  color: #666;
  font-size: 12px;
  margin: 4px 0 0;
}

.project-rank__meta {
  color: #999;
}

.project-rank__hint {
  color: #999;
  font-size: 12px;
  padding: 0 16px 24px;
  text-align: center;
}
</style>
