<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { IMG } from "@/config/aggregation-rank"
import type { ErshouRankingArea, ErshouRankingBizCircle } from "@/types/ershou-ranking"

const props = defineProps<{
  visible: boolean
  mode: "bizCircle" | "area"
  areas: ErshouRankingArea[]
  areaId: number
  bizCircleId: number
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "confirm", payload: { areaId: number; bizCircleId: number; label: string }): void
}>()

const draftAreaId = ref(-1)
const draftBizCircleId = ref(-1)

const areaList = computed(() => {
  const list = props.areas.map((area) => ({
    ...area,
    bizCircles: area.bizCircles ?? [],
  }))
  if (list.some((item) => item.areaId === -1)) return list
  return [{ areaId: -1, area: "全城", bizCircles: [{ id: -1, name: "不限" }] }, ...list]
})

const activeArea = computed(() =>
  areaList.value.find((item) => item.areaId === draftAreaId.value) ?? areaList.value[0],
)

const circleList = computed(() => activeArea.value?.bizCircles ?? [])

watch(
  () => props.visible,
  (open) => {
    if (!open) return
    draftAreaId.value = props.areaId
    draftBizCircleId.value = props.bizCircleId
  },
  { immediate: true },
)

function selectArea(area: ErshouRankingArea) {
  draftAreaId.value = area.areaId ?? -1
  const firstCircle = area.bizCircles?.find((item) => item.name !== "不限") ?? area.bizCircles?.[0]
  draftBizCircleId.value = firstCircle?.id ?? -1
}

function selectCircle(circle: ErshouRankingBizCircle) {
  draftBizCircleId.value = circle.id ?? -1
}

function reset() {
  draftAreaId.value = -1
  draftBizCircleId.value = -1
}

function confirm() {
  const area = areaList.value.find((item) => item.areaId === draftAreaId.value)
  let label = "全城"
  if (area && draftAreaId.value !== -1) {
    if (draftBizCircleId.value === -1) {
      label = area.area || "全城"
    } else {
      const circle = area.bizCircles?.find((item) => item.id === draftBizCircleId.value)
      label = circle?.name || area.area || "全城"
    }
  }
  emit("confirm", {
    areaId: draftAreaId.value,
    bizCircleId: draftBizCircleId.value,
    label,
  })
}
</script>

<template>
  <div v-if="visible" class="agg-area-mask" @click="emit('close')">
    <div class="agg-area-picker" @click.stop>
      <div class="agg-area-picker__wall">
        <header class="agg-area-picker__head">
          <span>{{ mode === "bizCircle" ? "请选择区域" : "请选择区域" }}</span>
          <button type="button" class="agg-area-picker__close" @click="emit('close')">
            <img :src="IMG.areaPickerClose" alt="" />
          </button>
        </header>

        <div v-if="mode === 'bizCircle'" class="agg-area-picker__body agg-area-picker__body--split">
          <div class="agg-area-picker__districts">
            <button
              v-for="area in areaList"
              :key="`${area.areaId}-${area.area}`"
              type="button"
              class="agg-area-picker__district"
              :class="{ 'agg-area-picker__district--active': draftAreaId === area.areaId }"
              @click="selectArea(area)"
            >
              {{ area.area }}
            </button>
          </div>
          <div class="agg-area-picker__circles">
            <button
              v-for="circle in circleList.filter((item) => item.name !== '不限')"
              :key="`${draftAreaId}-${circle.id}`"
              type="button"
              class="agg-area-picker__circle"
              :class="{ 'agg-area-picker__circle--active': draftBizCircleId === circle.id }"
              @click="selectCircle(circle)"
            >
              {{ circle.name }}
            </button>
          </div>
        </div>

        <div v-else class="agg-area-picker__body">
          <button
            v-for="area in areaList.filter((item) => item.areaId !== -1)"
            :key="`${area.areaId}-${area.area}`"
            type="button"
            class="agg-area-picker__area-item"
            :class="{ 'agg-area-picker__area-item--active': draftAreaId === area.areaId }"
            @click="selectArea(area)"
          >
            {{ area.area }}
          </button>
        </div>

        <footer class="agg-area-picker__footer">
          <button type="button" class="agg-area-picker__reset" @click="reset">重置</button>
          <button type="button" class="agg-area-picker__confirm" @click="confirm">确定</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.agg-area-mask {
  --rpx: calc(100vw / 750);
  align-items: flex-end;
  background: rgb(0 0 0 / 45%);
  display: flex;
  inset: 0;
  position: fixed;
  z-index: 30;
}

.agg-area-picker {
  width: 100%;
}

.agg-area-picker__wall {
  animation: agg-area-slide-up 0.3s ease-out;
  background: #fff;
  border-radius: calc(32 * var(--rpx)) calc(32 * var(--rpx)) 0 0;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: hidden;
}

.agg-area-picker__head {
  align-items: center;
  border-bottom: calc(1 * var(--rpx)) solid rgb(0 0 0 / 7%);
  display: flex;
  flex-shrink: 0;
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  height: calc(90 * var(--rpx));
  justify-content: space-between;
  padding: 0 calc(32 * var(--rpx));
}

.agg-area-picker__close {
  appearance: none;
  background: none;
  border: none;
  height: calc(64 * var(--rpx));
  padding: 0;
  width: calc(96 * var(--rpx));

  img {
    height: calc(64 * var(--rpx));
    width: calc(96 * var(--rpx));
  }
}

.agg-area-picker__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: calc(16 * var(--rpx)) calc(32 * var(--rpx));
}

.agg-area-picker__body--split {
  display: flex;
  padding: 0;
}

.agg-area-picker__districts {
  background: #f7f7f7;
  flex: 0 0 calc(220 * var(--rpx));
  max-height: calc(520 * var(--rpx));
  overflow-y: auto;
}

.agg-area-picker__district {
  appearance: none;
  background: none;
  border: none;
  color: rgb(0 0 0 / 65%);
  display: block;
  font-size: calc(28 * var(--rpx));
  line-height: calc(40 * var(--rpx));
  padding: calc(24 * var(--rpx)) calc(20 * var(--rpx));
  text-align: left;
  width: 100%;
}

.agg-area-picker__district--active {
  background: #fff;
  color: #2d8cf0;
  font-weight: 700;
}

.agg-area-picker__circles {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: calc(16 * var(--rpx));
  max-height: calc(520 * var(--rpx));
  overflow-y: auto;
  padding: calc(24 * var(--rpx));
}

.agg-area-picker__circle {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  font-size: calc(24 * var(--rpx));
  padding: calc(12 * var(--rpx)) calc(20 * var(--rpx));
}

.agg-area-picker__circle--active {
  background: rgb(45 140 240 / 10%);
  color: #2d8cf0;
  font-weight: 700;
}

.agg-area-picker__area-item {
  appearance: none;
  background: #f5f7fa;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #606266;
  display: block;
  font-size: calc(28 * var(--rpx));
  margin-bottom: calc(16 * var(--rpx));
  padding: calc(20 * var(--rpx)) calc(24 * var(--rpx));
  text-align: left;
  width: 100%;
}

.agg-area-picker__area-item--active {
  background: rgb(45 140 240 / 10%);
  color: #2d8cf0;
  font-weight: 700;
}

.agg-area-picker__footer {
  box-shadow: 0 calc(-4 * var(--rpx)) calc(12 * var(--rpx)) rgb(21 24 45 / 3%);
  display: flex;
  flex-shrink: 0;
  gap: calc(22 * var(--rpx));
  padding: calc(28 * var(--rpx)) calc(32 * var(--rpx));
  padding-bottom: calc(28 * var(--rpx) + env(safe-area-inset-bottom));
}

.agg-area-picker__reset {
  appearance: none;
  background: #fff;
  border: calc(2 * var(--rpx)) solid #2d8cf0;
  border-radius: calc(8 * var(--rpx));
  color: #2d8cf0;
  flex: 0 0 calc(168 * var(--rpx));
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  height: calc(88 * var(--rpx));
}

.agg-area-picker__confirm {
  appearance: none;
  background: #2d8cf0;
  border: none;
  border-radius: calc(8 * var(--rpx));
  color: #fff;
  flex: 1;
  font-size: calc(32 * var(--rpx));
  font-weight: 700;
  height: calc(88 * var(--rpx));
}

@keyframes agg-area-slide-up {
  from {
    transform: translateY(calc(600 * var(--rpx)));
  }

  to {
    transform: translateY(0);
  }
}
</style>
