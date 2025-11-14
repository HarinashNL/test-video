// stores/reels.ts
import { defineStore } from "pinia";

export interface Reel {
  id: number;
  title: string;
  src: string;
}

interface ReelsState {
  items: Reel[];
  currentIndex: number;
  isInitialLoading: boolean;
  isMoreLoading: boolean;
  error: string | null;
  hasMore: boolean;
  nextPage: number | null;
}

interface ReelsApiResponse {
  items: Reel[];
  page: number;
  nextPage: number | null;
  hasMore: boolean;
}

export const useReelsStore = defineStore("reels", {
  state: (): ReelsState => ({
    items: [],
    currentIndex: 0,
    isInitialLoading: false,
    isMoreLoading: false,
    error: null,
    hasMore: true,
    nextPage: 1,
  }),

  actions: {
    setCurrentIndex(index: number) {
      this.currentIndex = index;
    },

    async fetchInitialReels(limit = 10) {
      this.isInitialLoading = true;
      this.error = null;
      this.items = [];
      this.currentIndex = 0;
      this.hasMore = true;
      this.nextPage = 1;

      try {
        const res = await $fetch<ReelsApiResponse>("/api/reels", {
          params: { page: 1, limit },
        });

        this.items = res.items;
        this.hasMore = res.hasMore;
        this.nextPage = res.nextPage;
      } catch (err: any) {
        this.error = err?.message ?? "Failed to load reels";
        this.hasMore = false;
      } finally {
        this.isInitialLoading = false;
      }
    },

    async fetchMoreReels(limit = 10) {
      if (!this.hasMore || this.nextPage == null || this.isMoreLoading) return;

      this.isMoreLoading = true;
      this.error = null;

      try {
        const res = await $fetch<ReelsApiResponse>("/api/reels", {
          params: { page: this.nextPage, limit },
        });

        this.items.push(...res.items);
        this.hasMore = res.hasMore;
        this.nextPage = res.nextPage;
      } catch (err: any) {
        this.error = err?.message ?? "Failed to load more reels";
      } finally {
        this.isMoreLoading = false;
      }
    },

    async ensureBufferAround(index: number) {
      // clamp index
      const clamped = Math.min(Math.max(index, 0), this.items.length - 1);
      this.setCurrentIndex(clamped);

      // how close to the end we should be before loading more
      const threshold = 3;
      const remaining = this.items.length - 1 - clamped;

      if (remaining <= threshold && this.hasMore && !this.isMoreLoading) {
        await this.fetchMoreReels();
      }
    },
  },
});
