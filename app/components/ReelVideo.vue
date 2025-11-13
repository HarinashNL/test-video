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
        @click="togglePlay"
    ></video>

        <!-- Simple overlay controls -->
    <div class="controls">
      <button class="ctrl-btn" @click.stop="togglePlay">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button class="ctrl-btn" @click.stop="increaseVolume">
        Vol +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
  active: boolean;
  shouldPreload: boolean;
}>();

const videoEl = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false)

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

const pauseVideo = () => {
  const video = videoEl.value
  if (!video) return
  video.pause()
  isPlaying.value = false
}

// Toggle when clicking video or Play/Pause button
const togglePlay = () => {
  const video = videoEl.value
  if (!video) return

  if (video.paused) {
    // user interaction: safe to unmute if you want sound
    video.muted = false
    playSafe()
  } else {
    pauseVideo()
  }
}

const increaseVolume = () => {
  const video = videoEl.value
  if (!video) return
  video.muted = false
  video.volume = Math.min(1, (video.volume || 0) + 0.25)
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

// 2) On mount, if already active, start autoplay
onMounted(() => {
  if (props.active) {
    const video = videoEl.value
    if (video) {
      video.muted = true
    }
    playSafe()
  }
})
</script>

<style scoped>
.reel-video {
  position: relative;
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
  background: #000;
}

/* Controls overlay */
.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.ctrl-btn {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
</style>
