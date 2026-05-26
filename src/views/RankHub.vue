<template>
  <div class="rank-hub">
    <div class="rank-hub__header" :style="{ backgroundImage: `url(${RANK_HUB_HEADER_BG})` }" />

    <div class="rank-hub__list">
      <button
        v-for="item in RANK_HUB_ITEMS"
        :key="item.id"
        type="button"
        class="rank-hub__card"
        @click="go(item)"
      >
        <img class="rank-hub__card-img" :src="item.imageUrl" :alt="item.title" />
      </button>
    </div>

    <footer class="rank-hub__slogan">
      <img class="rank-hub__slogan-img" :src="RANK_HUB_SLOGAN" alt="" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { RANK_HUB_HEADER_BG, RANK_HUB_ITEMS, RANK_HUB_SLOGAN, type RankHubItem } from "@/config/rank-hub-items"
import { rankRouteById } from "@/config/rank-routes"

const router = useRouter()

onMounted(() => {
  document.title = "榜单中心"
})

function go(item: RankHubItem) {
  const route = rankRouteById(item.id)
  if (!route) return
  router.push({ path: route.path, query: item.query })
}
</script>

<style scoped>
.rank-hub {
  background: #ffe7d1;
  min-height: 100vh;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

.rank-hub__header {
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 146px;
  width: 100%;
}

.rank-hub__list {
  margin-top: -67px;
  padding: 0 15px;
}

.rank-hub__card {
  appearance: none;
  background: none;
  border: none;
  display: block;
  margin: 0 auto 14px;
  padding: 0;
  width: 100%;
}

.rank-hub__card-img {
  aspect-ratio: 690 / 284;
  display: block;
  height: auto;
  width: 100%;
}

.rank-hub__slogan {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 24px 0 12px;
}

.rank-hub__slogan-img {
  height: 40px;
  width: auto;
}
</style>
