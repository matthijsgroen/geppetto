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
      ],
      thresholds: {
        lines: 98,
        branches: 92,
        functions: 97,
        statements: 98,
      },
    },
  },
});
