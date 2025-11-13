<!-- pages/reels.vue -->
<template>
  <div class="reels-page">
    <ClientOnly>
      <Swiper
        class="reels-swiper"
        :modules="modules"
        direction="vertical"
        :slides-per-view="1"
        :space-between="0"
        :mousewheel="{ forceToAxis: true, releaseOnEdges: false }"
        :keyboard="{ enabled: true, onlyInViewport: true }"
        @slideChange="onSlideChange"
      >
        <SwiperSlide
          v-for="(reel, index) in items"
          :key="reel.id"
        >
          <ReelVideo
            :src="reel.src"
            :active="isActive(index)"
            :should-preload="shouldPreload(index)"
          />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Keyboard, Mousewheel } from 'swiper/modules'
import { useReelsPlayer } from '~/composables/useReelsPlayer'
import ReelVideo from '~/components/ReelVideo.vue'

const modules = [Keyboard, Mousewheel]

const { items, handleSlideChange, isActive, shouldPreload } = useReelsPlayer()

// Ensure first reel is marked as active on mount
// onMounted(() => {
//   handleSlideChange(0)
// })

useHead({
  bodyAttrs: {
    class: 'body-no-scroll',
  },
})

const onSlideChange = (swiper: any) => {
  handleSlideChange(swiper.activeIndex)
}
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
</style>
