<template>
  <div class="rank-hub">
    <header class="rank-hub__nav">
      <button type="button" class="rank-hub__back" aria-label="返回" @click="onBack">‹</button>
      <h1 class="rank-hub__title">榜单中心</h1>
    </header>

    <main class="rank-hub__main">
      <img
        class="rank-hub__banner"
        alt=""
        src="https://imgcdn.huanjutang.com/image/2023/09/26/288a14f8e50670929a0c3aff4dcb0705.png"
      />

      <section v-for="section in sections" :key="section.title" class="rank-hub__section">
        <h2 class="rank-hub__section-title">{{ section.title }}</h2>
        <div class="rank-hub__grid">
          <button
            v-for="item in section.items"
            :key="item.id"
            type="button"
            class="rank-hub__cell"
            @click="go(item.path)"
          >
            <img class="rank-hub__icon" :src="item.iconUrl" alt="" />
            <span class="rank-hub__label">{{ item.title }}</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { rankRouteById } from "@/config/rank-routes"

const router = useRouter()

const ICON =
  "https://imgcdn.huanjutang.com/image/2023/03/21/05d4ab44457017bd94c483c3432e5006.png"
const ICON_PROJECT =
  "https://imgcdn.huanjutang.com/image/2023/03/07/b2df9447bbc3bfa8fd6b8c5abd0022a0.png"

const sections = computed(() => {
  const cell = (id: string, icon = ICON) => {
    const r = rankRouteById(id)!
    return { id, title: r.title, path: r.path, iconUrl: icon }
  }
  return [
    {
      title: "新房榜单",
      items: [
        cell("sell-rank"),
        cell("project-rank", ICON_PROJECT),
        cell("new-house-price"),
        cell("house-type-popularity"),
        cell("house-ladder"),
      ],
    },
    {
      title: "二手房榜单",
      items: [cell("house-search-rank"), cell("aggregation-rank"), cell("ershou-ranking")],
    },
    { title: "土拍榜单", items: [cell("auction-rank")] },
  ]
})

function go(path: string) {
  router.push(path)
}

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
.rank-hub {
  background: #f6f6f6;
  min-height: 100vh;
}

.rank-hub__nav {
  align-items: center;
  background: #ffe7d1;
  display: flex;
  height: 44px;
  padding: env(safe-area-inset-top) 12px 0;
}

.rank-hub__back {
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  padding: 8px 12px;
}

.rank-hub__title {
  flex: 1;
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.rank-hub__banner {
  display: block;
  width: 100%;
}

.rank-hub__section {
  padding: 12px 16px;
}

.rank-hub__section-title {
  font-size: 16px;
  margin: 0 0 12px;
}

.rank-hub__grid {
  display: flex;
  flex-wrap: wrap;
}

.rank-hub__cell {
  align-items: center;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 33.333%;
}

.rank-hub__icon {
  height: 48px;
  width: 48px;
}

.rank-hub__label {
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  margin-top: 8px;
}
</style>
