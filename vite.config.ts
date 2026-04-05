import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.svg"],
      manifest: {
        name: "Peerly — Peer Review Platform",
        short_name: "Peerly",
        description: "Платформа взаимного оценивания для вузов",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "pwa-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cache static assets (JS, CSS, fonts, SVGs)
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        globIgnores: ["**/bundle-stats.html"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
        runtimeCaching: [
          {
            // Cache API responses (stale-while-revalidate)
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        // Offline fallback
        navigateFallback: "/offline.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
    visualizer({
      filename: "dist/bundle-stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-popover",
          ],
          "vendor-mui": ["@mui/material", "@mui/icons-material"],
          "vendor-charts": ["recharts"],
          "vendor-i18n": ["i18next", "react-i18next"],
          "vendor-sentry": ["@sentry/react"],
        },
      },
    },
  },
});
