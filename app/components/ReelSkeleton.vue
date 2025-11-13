<!-- components/ReelSkeleton.vue -->
<template>
    <div class="reel-skeleton">
        <div class="reel-skeleton__shimmer" />
    </div>
</template>

<style scoped>
.reel-skeleton {
    width: 100%;
    height: 100vh;
    background: #050505;
    position: relative;
    overflow: hidden;
}

.reel-skeleton__shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            #050505 0%,
            #222 50%,
            #050505 100%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>
