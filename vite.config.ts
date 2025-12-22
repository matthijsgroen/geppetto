import path from "node:path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  plugins: [glsl(), tailwindcss(), svgrPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
