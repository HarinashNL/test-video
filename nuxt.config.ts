// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],

  css: [
    "swiper/css", // basic Swiper styles
    "@/assets/main.css",
  ],

  build: {
    transpile: ["swiper"],
  },
});
