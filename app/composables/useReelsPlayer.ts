// composables/useReelsPlayer.ts
import { storeToRefs } from 'pinia'
import { useReelsStore } from '~/stores/reels'

export function useReelsPlayer() {
  const store = useReelsStore()
  const { items, currentIndex } = storeToRefs(store)

  const handleSlideChange = (newIndex: number) => {
    // Clamp just in case
    const clamped = Math.min(Math.max(newIndex, 0), items.value.length - 1)
    store.setCurrentIndex(clamped)
  }

  const isActive = (index: number) => {
    return index === currentIndex.value
  }

  const shouldPreload = (index: number) => {
    // current, next 1, next 2
    return index === currentIndex.value ||
      index === currentIndex.value + 1 ||
      index === currentIndex.value + 2
  }

  return {
    items,
    currentIndex,
    handleSlideChange,
    isActive,
    shouldPreload,
  }
}
