<!-- components/ReelVideo.vue -->
<template>
  <div class="reel-video">
    <video
      ref="videoEl"
      class="reel-video__player"
      :src="src"
      playsinline
      muted
      loop
      :preload="preloadMode"
    ></video>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
  active: boolean;
  shouldPreload: boolean;
}>();

const videoEl = ref<HTMLVideoElement | null>(null);

const preloadMode = computed(() => {
  return props.shouldPreload ? "auto" : "metadata";
});

const playSafe = async () => {
  const video = videoEl.value
  if (!video) return
  try {
    await video.play()
  } catch (err) {
    console.warn('Autoplay failed:', err)
  }
}

// 1) When `active` changes (for swiping)
watch(
  () => props.active,
  (isActive) => {
    const video = videoEl.value
    if (!video) return

    if (isActive) {
      playSafe()
    } else {
      video.pause()
    }
  }
)

// 2) When the component mounts for the first time
onMounted(() => {
  if (props.active) {
    playSafe()
  }
})
</script>

<style scoped>
.reel-video {
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reel-video__player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: black;
}
</style>
