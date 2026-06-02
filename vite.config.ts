import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "bundle-stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api-stage.prly.ru",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          const slice = chunkInfo.facadeModuleId?.match(/\/src\/pages\/(.+)\/index\.ts$/)?.[1];
          if (slice) {
            return `assets/page-${slice.replace(/\//g, "-")}-[hash].js`;
          }
          return "assets/[name]-[hash].js";
        },
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-query",
            "i18next",
            "react-i18next",
          ],
          "vendor-extras": ["recharts", "@sentry/react"],
        },
      },
    },
  },
});
