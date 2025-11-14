<!-- pages/reels.vue -->
<template>
  <div class="reels-page">
    <ClientOnly>
      <div class="reels-wrapper">
        <!-- Initial loading -->
        <ReelSkeleton v-if="isInitialLoading" />

        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="reload">Retry</button>
        </div>

        <!-- Reels -->
        <template v-else>
          <Swiper
            class="reels-swiper"
            :modules="modules"
            direction="vertical"
            :slides-per-view="1"
            :space-between="0"
            :mousewheel="{ forceToAxis: true, releaseOnEdges: false }"
            :keyboard="{ enabled: true, onlyInViewport: true }"
            @slideChange="onSlideChange"
            @swiper="onSwiperReady"
          >
            <SwiperSlide v-for="(reel, index) in items" :key="reel.id">
              <ReelVideo
                :src="reel.src"
                :active="isActive(index)"
                :should-preload="shouldPreload(index)"
              />
            </SwiperSlide>
          </Swiper>

          <!-- Right-side up/down buttons -->
          <div class="reels-nav-buttons">
            <button
              class="nav-btn"
              :class="{ 'nav-btn--disabled': isAtTop }"
              :disabled="isAtTop"
              @click="!isAtTop && goPrev()"
            >
              <i class="fa-solid fa-chevron-up"></i>
            </button>

            <button
              class="nav-btn"
              :class="{ 'nav-btn--disabled': isAtBottom }"
              :disabled="isAtBottom"
              @click="!isAtBottom && goNext()"
            >
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          <!-- Bottom loading indicator when fetching more -->
          <div v-if="isMoreLoading" class="bottom-loading">Loading more...</div>
        </template>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Keyboard, Mousewheel } from "swiper/modules";
import { useReelsPlayer } from "~/composables/useReelsPlayer";
import ReelVideo from "~/components/ReelVideo.vue";
import ReelSkeleton from "~/components/ReelSkeleton.vue";

useHead({
  bodyAttrs: {
    class: "body-no-scroll",
  },
});

const modules = [Keyboard, Mousewheel];

const {
  items,
  currentIndex,
  isInitialLoading,
  isMoreLoading,
  error,
  fetchInitialReels,
  handleSlideChange,
  isActive,
  shouldPreload,
} = useReelsPlayer();

const swiperRef = ref<any | null>(null);

onMounted(() => {
  fetchInitialReels();
});

const isAtTop = computed(() => currentIndex.value === 0);
const isAtBottom = computed(
  () => items.value.length > 0 && currentIndex.value === items.value.length - 1
);

const onSwiperReady = (swiper: any) => {
  swiperRef.value = swiper;
};

const onSlideChange = (swiper: any) => {
  handleSlideChange(swiper.activeIndex);
};

const goPrev = () => {
  swiperRef.value?.slidePrev();
};

const goNext = () => {
  swiperRef.value?.slideNext();
};

const reload = () => {
  fetchInitialReels();
};

// Ensure first reel is marked as active on mount
// onMounted(() => {
//   handleSlideChange(0)
// })
</script>

<style scoped>
.reels-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.reels-swiper {
  width: 100%;
  height: 100vh;
}

/* Positioning wrapper so buttons can overlay on top */
.reels-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Right-side vertical buttons */
.reels-nav-buttons {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 20;
  pointer-events: auto;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: #222;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  opacity: 1;
}

.nav-btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn--disabled:hover {
  opacity: 0.3;
}

/* Error & bottom loading */
.error-state {
  width: 100%;
  height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.error-state button {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}

.bottom-loading {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: #aaa;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 999px;
}

/* === Mobile === */
@media (max-width: 768px) {
  .reels-nav-buttons {
    display: none;
  }
}
</style>
