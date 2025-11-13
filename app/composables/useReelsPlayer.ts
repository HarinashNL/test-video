// composables/useReelsPlayer.ts
import { storeToRefs } from "pinia";
import { useReelsStore } from "~/stores/reels";

export function useReelsPlayer() {
  const store = useReelsStore();
  const {
    items,
    currentIndex,
    isInitialLoading,
    isMoreLoading,
    hasMore,
    error,
  } = storeToRefs(store);

  const fetchInitialReels = () => store.fetchInitialReels();

  const handleSlideChange = (newIndex: number) => {
    store.ensureBufferAround(newIndex);
  };

  const isActive = (index: number) => index === currentIndex.value;

  const shouldPreload = (index: number) => {
    return (
      index === currentIndex.value ||
      index === currentIndex.value + 1 ||
      index === currentIndex.value + 2
    );
  };

  return {
    items,
    currentIndex,
    isInitialLoading,
    isMoreLoading,
    hasMore,
    error,
    fetchInitialReels,
    handleSlideChange,
    isActive,
    shouldPreload,
  };
}
