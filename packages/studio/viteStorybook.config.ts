import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), glsl(), tailwindcss(), svgrPlugin()],
  base: "/storybook/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sb": path.resolve(__dirname, "./.storybook"),
    },
    dedupe: ["react", "react-dom"],
  },
});
