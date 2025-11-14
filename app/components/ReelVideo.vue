<template>
  <div class="reel-video">
    <div class="video-frame">
      <video
        ref="videoEl"
        class="reel-video__player"
        :src="src"
        playsinline
        muted
        loop
        :preload="preloadMode"
        @click="handleTogglePlay"
      ></video>

      <!-- Play / Pause overlay (briefly shown after toggle) -->
      <div v-if="showOverlayIcon" class="overlay-play-pause">
        <!-- Show icon for the NEW state -->
        <i v-if="!isPlaying" class="fa-solid fa-play"></i>
        <i v-else class="fa-solid fa-pause"></i>
      </div>

<!-- Top-left controls, inside video-frame -->
<div class="top-controls" @click.stop>
  <!-- Play / Pause -->
  <button class="circle-btn" @click.stop="handleTogglePlay">
    <i v-if="!isPlaying" class="fa-solid fa-play"></i>
    <i v-else class="fa-solid fa-pause"></i>
  </button>

  <!-- Volume icon + slider (slider only shown on hover) -->
  <div class="volume-wrapper">
    <button class="circle-btn" @click.stop="toggleMute">
      <i :class="volumeIconClass"></i>
    </button>

    <input
      class="volume-slider"
      type="range"
      min="0"
      max="1"
      step="0.05"
      v-model.number="volume"
      @input="onVolumeChange"
    />
  </div>
</div>

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
const isPlaying = ref(false);
const isMuted = ref(true);
const volume = ref(0);
const lastVolume = ref(0);

const showOverlayIcon = ref(false);
const overlayTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const preloadMode = computed(() => (props.shouldPreload ? "auto" : "metadata"));

const volumeIconClass = computed(() => {
  if (isMuted.value || volume.value === 0) return "fa-solid fa-volume-xmark";
  if (volume.value < 0.5) return "fa-solid fa-volume-low";
  return "fa-solid fa-volume-high";
});

const playSafe = async () => {
  const video = videoEl.value;
  if (!video) return;
  try {
    await video.play();
    isPlaying.value = true;
  } catch (err) {
    console.warn("Play failed:", err);
    isPlaying.value = false;
  }
};

const pauseVideo = () => {
  const video = videoEl.value;
  if (!video) return;
  video.pause();
  isPlaying.value = false;
};

const showPlayPauseOverlay = () => {
  showOverlayIcon.value = true;
  if (overlayTimeout.value) clearTimeout(overlayTimeout.value);
  overlayTimeout.value = setTimeout(() => {
    showOverlayIcon.value = false;
  }, 700);
};

/**
 * SUPER SIMPLE toggle: if paused -> play, else -> pause.
 * This runs on click anywhere in the reel-video container,
 * except where we use @click.stop (volume-control).
 */
const handleTogglePlay = () => {
  const video = videoEl.value;
  if (!video) return;

  if (video.paused) {
    playSafe();
  } else {
    pauseVideo();
  }

  showPlayPauseOverlay();
};

const toggleMute = () => {
  const video = videoEl.value;
  if (!video) return;

  if (isMuted.value) {
    // unmute, restore last volume
    const target = lastVolume.value || 0.5;
    video.muted = false;
    video.volume = target;
    volume.value = target;
    isMuted.value = false;
  } else {
    // mute, remember current volume
    lastVolume.value = video.volume || lastVolume.value;
    video.muted = true;
    video.volume = 0;
    volume.value = 0;
    isMuted.value = true;
  }
};

const onVolumeChange = () => {
  const video = videoEl.value;
  if (!video) return;

  video.volume = volume.value;
  if (volume.value === 0) {
    isMuted.value = true;
    video.muted = true;
  } else {
    isMuted.value = false;
    video.muted = false;
    lastVolume.value = volume.value;
  }
};

// When the slide becomes active/inactive
watch(
  () => props.active,
  (isActive) => {
    const video = videoEl.value;
    if (!video) return;

    if (isActive) {
      isMuted.value = true;
      video.muted = true;
      playSafe(); // autoplay muted
    } else {
      pauseVideo();
    }
  }
);

// Init on mount
onMounted(() => {
  const video = videoEl.value;
  if (!video) return;

  video.volume = lastVolume.value;
  video.muted = true;

  if (props.active) {
    playSafe();
  }
});

// Cleanup (your original idea, just kept)
onUnmounted(() => {
  const video = videoEl.value;
  if (video) {
    video.pause();
    video.src = "";
    video.load();
  }
  if (overlayTimeout.value) clearTimeout(overlayTimeout.value);
});
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

/* This frame matches the video column and is centered */
.video-frame {
  position: relative;
  height: 100%;
  max-height: 100%;
  width: min(100%, 420px); /* tweak width to your liking */
  display: flex;
  justify-content: center;
  align-items: center;
}

.reel-video__player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

/* Center overlay icon */
.overlay-play-pause {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.overlay-play-pause i {
  font-size: 42px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
}

/* Top-left controls, relative to video-frame, not the whole screen */
.top-controls {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Only show when hovering the video area */
.video-frame:hover .top-controls {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* Circular buttons for play / volume */
.circle-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-btn i {
  font-size: 14px;
}

/* Wrap volume icon + slider */
.volume-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

/* Slider is hidden by default */
.volume-slider {
  width: 0;
  height: 4px;
  cursor: pointer;
  appearance: none;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  margin-left: 6px;
  opacity: 0;
  pointer-events: none;
  transition: width 0.2s ease, opacity 0.2s ease;
}

/* Show slider when hovering the volume wrapper (icon area) */
.volume-wrapper:hover .volume-slider {
  width: 100px;
  opacity: 1;
  pointer-events: auto;
}

/* Chrome/Edge slider thumb */
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

/* Chrome/Edge thumb */
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

/* Firefox slider thumb */
.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}
</style>
