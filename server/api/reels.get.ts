// server/api/reels.get.ts
import { defineEventHandler, getQuery } from "h3";

type Reel = {
  id: number;
  title: string;
  src: string;
};

// Simulate 12 videos (repeat your 3 test files)
const BASE_VIDEOS: Omit<Reel, "id">[] = [
  { title: "Test 1", src: "http://quiz.apps4all.vip/test.mp4" },
  { title: "Test 2", src: "http://quiz.apps4all.vip/test2.mp4" },
  { title: "Test 3", src: "http://quiz.apps4all.vip/test3.mp4" },
];

// Make a longer list (simulate ~100 later if you want)
const ALL_REELS: Reel[] = Array.from({ length: 24 }).map((_, i) => {
  const base = BASE_VIDEOS[i % BASE_VIDEOS.length];
  return {
    id: i + 1,
    title: `${base.title} #${i + 1}`,
    src: base.src,
  };
});

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  const start = (page - 1) * limit;
  const end = start + limit;

  const items = ALL_REELS.slice(start, end);
  const hasMore = end < ALL_REELS.length;
  const nextPage = hasMore ? page + 1 : null;

  return {
    items,
    page,
    nextPage,
    hasMore,
  };
});
