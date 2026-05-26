<template>
  <div class="placeholder">
    <p class="placeholder__hint">页面壳已就绪，业务数据与交互待接 mfm-api。</p>
    <router-link class="placeholder__link" to="/pages/tools/app-list/rank">返回榜单中心</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const title = computed(() => String(route.meta.title ?? "榜单"))

function onBack() {
  router.back()
}
</script>

<style scoped>
.placeholder {
  min-height: 100vh;
  padding: 24px;
  text-align: center;
}

.placeholder__nav {
  align-items: center;
  display: flex;
  margin: 0 -8px 24px;
}

.placeholder__back {
  background: none;
  border: none;
  font-size: 28px;
}

.placeholder__title {
  flex: 1;
  font-size: 17px;
  margin: 0;
}

.placeholder__hint {
  color: #666;
  line-height: 1.6;
}

.placeholder__link {
  color: #2979ff;
  display: inline-block;
  margin-top: 24px;
}
</style>
