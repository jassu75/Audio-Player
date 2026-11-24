import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["icons/*.png", "images/favicon.ico"],
      manifest: {
        id: "/",
        name: "Musify",
        short_name: "Musify",
        description: "Your music, wherever you listen.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        theme_color: "#202020",
        background_color: "#202020",
        prefer_related_applications: false,
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          { name: "Search music", url: "/search" },
          { name: "Favorites", url: "/favorites" },
        ],
      },
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
        globPatterns: ["**/*.{js,css,html,png,ico,svg,webp,jpg,jpeg}"],
        navigateFallbackDenylist: [/^\/api(?:\/|$)/, /^\/__(?:\/|$)/],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    proxy: { "/api": "http://localhost:8080" },
  },
  preview: { port: 4173, strictPort: true },
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,
  },
});
