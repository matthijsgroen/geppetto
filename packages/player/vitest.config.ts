import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      exclude: [
        "node_modules/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.bench.ts",
        "**/player.ts", // WebGL code requires browser environment
        "**/traverse.ts", // Internal utility, tested via integration
      ],
      thresholds: {
        lines: 88,
        branches: 70,
        functions: 80,
        statements: 88,
      },
    },
  },
});
