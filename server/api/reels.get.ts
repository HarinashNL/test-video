// server/api/reels.get.ts
import { defineEventHandler, getQuery } from 'h3'

type Reel = {
  id: number
  title: string
  src: string
}

// Base videos from your S3
const BASE_VIDEOS: Omit<Reel, 'id'>[] = [
  { title: 'Test 1', src: 'http://quiz.apps4all.vip/test.mp4' },
  { title: 'Test 2', src: 'http://quiz.apps4all.vip/test2.mp4' },
  { title: 'Test 3', src: 'http://quiz.apps4all.vip/test3.mp4' },
]

// Simulate a longer list (you can change 100 to any number)
const ALL_REELS: Reel[] = Array.from({ length: 100 }).map((_, i) => {
  const base = BASE_VIDEOS[i % BASE_VIDEOS.length]
  return {
    id: i + 1,
    title: `${base.title} #${i + 1}`,
    src: base.src,
  }
})

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const limit = Number(query.limit ?? 10)

  // Cursor is an opaque string, we interpret it as "start index"
  const cursor =
    typeof query.cursor === 'string' && query.cursor !== ''
      ? Number.parseInt(query.cursor, 10)
      : 0

  const start = Number.isFinite(cursor) && cursor >= 0 ? cursor : 0
  const end = start + limit

  const items = ALL_REELS.slice(start, end)
  const hasMore = end < ALL_REELS.length
  const nextCursor = hasMore ? String(end) : null

  return {
    items,
    nextCursor, // null when no more items
    hasMore,
  }
})
