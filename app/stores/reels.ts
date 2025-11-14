// stores/reels.ts
import { defineStore } from 'pinia'

export interface Reel {
  id: number
  title: string
  src: string
}

interface ReelsState {
  items: Reel[]
  currentIndex: number
  isInitialLoading: boolean
  isMoreLoading: boolean
  error: string | null
  hasMore: boolean
  nextCursor: string | null
}

interface ReelsApiResponse {
  items: Reel[]
  nextCursor: string | null
  hasMore: boolean
}

export const useReelsStore = defineStore('reels', {
  state: (): ReelsState => ({
    items: [],
    currentIndex: 0,
    isInitialLoading: false,
    isMoreLoading: false,
    error: null,
    hasMore: true,
    nextCursor: null,
  }),

  actions: {
    setCurrentIndex(index: number) {
      this.currentIndex = index
    },

    async fetchInitialReels(limit = 10) {
      this.isInitialLoading = true
      this.error = null
      this.items = []
      this.currentIndex = 0
      this.hasMore = true
      this.nextCursor = null

      try {
        const res = await $fetch<ReelsApiResponse>('/api/reels', {
          params: { limit },
        })

        this.items = res.items
        this.hasMore = res.hasMore
        this.nextCursor = res.nextCursor
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load reels'
        this.hasMore = false
      } finally {
        this.isInitialLoading = false
      }
    },

    async fetchMoreReels(limit = 10) {
      if (!this.hasMore || !this.nextCursor || this.isMoreLoading) return

      this.isMoreLoading = true
      this.error = null

      try {
        const res = await $fetch<ReelsApiResponse>('/api/reels', {
          params: { cursor: this.nextCursor, limit },
        })

        this.items.push(...res.items)
        this.hasMore = res.hasMore
        this.nextCursor = res.nextCursor
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load more reels'
      } finally {
        this.isMoreLoading = false
      }
    },

    async ensureBufferAround(index: number) {
      // clamp index
      const clamped = Math.min(Math.max(index, 0), this.items.length - 1)
      this.setCurrentIndex(clamped)

      const threshold = 3
      const remaining = this.items.length - 1 - clamped

      if (remaining <= threshold && this.hasMore && !this.isMoreLoading) {
        await this.fetchMoreReels()
      }
    },
  },
})
