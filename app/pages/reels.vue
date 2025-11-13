<!-- pages/reels.vue -->
<template>
  <div class="reels-page">
    <ClientOnly>
      <div class="reels-wrapper">
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
          <button class="nav-btn" @click="goPrev">▲</button>
          <button class="nav-btn" @click="goNext">▼</button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Keyboard, Mousewheel } from "swiper/modules";
import { useReelsPlayer } from "~/composables/useReelsPlayer";
import ReelVideo from "~/components/ReelVideo.vue";

const modules = [Keyboard, Mousewheel];
const swiperRef = ref<any | null>(null);

const onSwiperReady = (swiper: any) => {
  swiperRef.value = swiper;
};

const goPrev = () => {
  swiperRef.value?.slidePrev();
};

const goNext = () => {
  swiperRef.value?.slideNext();
};

const { items, handleSlideChange, isActive, shouldPreload } = useReelsPlayer();

// Ensure first reel is marked as active on mount
// onMounted(() => {
//   handleSlideChange(0)
// })

useHead({
  bodyAttrs: {
    class: "body-no-scroll",
  },
});

const onSlideChange = (swiper: any) => {
  handleSlideChange(swiper.activeIndex);
};
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
  opacity: 0.8;
}

.nav-btn:hover {
  opacity: 1;
}
</style>
