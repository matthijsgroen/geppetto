import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";
import svgrPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    glsl(),
    tailwindcss(),
    svgrPlugin(),
    ...(process.env.PWA
      ? [
          VitePWA({
            registerType: "prompt",
            devOptions: {
              enabled: false, // Disable in dev to allow HMR
            },
            includeAssets: [
              "favicon.ico",
              "icon192.png",
              "icon512.png",
              "icon1024.png",
            ],
            filename: "service-worker.js",
            manifest: {
              short_name: "Geppetto",
              name: "Geppetto",
              description:
                "WebGL animation toolkit to create beautiful animations that also allow real-time control.",
              icons: [
                {
                  src: "favicon.ico",
                  sizes: "64x64",
                  type: "image/x-icon",
                },
                {
                  src: "icon192.png",
                  type: "image/png",
                  sizes: "192x192",
                  purpose: "maskable",
                },
                {
                  src: "icon512.png",
                  type: "image/png",
                  sizes: "512x512",
                  purpose: "maskable",
                },
                {
                  src: "icon1024.png",
                  type: "image/png",
                  sizes: "1024x1024",
                  purpose: "maskable",
                },
                {
                  src: "icon192.png",
                  type: "image/png",
                  sizes: "192x192",
                  purpose: "any",
                },
                {
                  src: "icon512.png",
                  type: "image/png",
                  sizes: "512x512",
                  purpose: "any",
                },
                {
                  src: "icon1024.png",
                  type: "image/png",
                  sizes: "1024x1024",
                  purpose: "any",
                },
              ],
              id: "/app/",
              start_url: ".?utm_source=app",
              display: "minimal-ui",
              theme_color: "#e79b62",
              background_color: "#e79b62",
              categories: ["2DGraphics", "design", "graphics", "utilities"],
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "google-fonts-cache",
                    expiration: {
                      maxEntries: 10,
                      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                    },
                    cacheableResponse: {
                      statuses: [0, 200],
                    },
                  },
                },
              ],
            },
          }),
        ]
      : []),
  ],
  base: "/app/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sb": path.resolve(__dirname, "./.storybook"),
    },
    dedupe: ["react", "react-dom"],
  },
});
