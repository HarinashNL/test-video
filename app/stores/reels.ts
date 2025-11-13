import { defineStore } from 'pinia'

export interface Reel {
  id: number
  title: string
  src: string
}

export const useReelsStore = defineStore('reels', {
  state: () => ({
    items: [
      {
        id: 1,
        title: 'Test 1',
        src: 'http://quiz.apps4all.vip/test.mp4',
      },
      {
        id: 2,
        title: 'Test 2',
        src: 'http://quiz.apps4all.vip/test2.mp4',
      },
      {
        id: 3,
        title: 'Test 3',
        src: 'http://quiz.apps4all.vip/test3.mp4',
      },
    ] as Reel[],
    currentIndex: 0,
  }),
  actions: {
    setCurrentIndex(index: number) {
      this.currentIndex = index
    },
  },
})
