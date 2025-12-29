/* global process -- Globals defined by node.js */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import prettierConfig from "eslint-config-prettier";
import tailwind from "eslint-plugin-tailwindcss";
import { join } from "node:path";

export default [
  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [".storybook/**", "bin/**"], // Exclude files not in tsconfig project
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
      "no-relative-import-paths": noRelativeImportPaths,
      tailwindcss: tailwind,
    },
    settings: {
      react: {
        version: "detect",
        runtime: "automatic", // React 17+ JSX transform - React doesn't need to be in scope
      },
      tailwindcss: {
        config: join(process.cwd(), "src", "ui", "index.css"),
      },
    },
    rules: {
      // Import sorting
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // Import paths - enforce @/ alias (auto-fixable!)
      // Allow relative imports within same module (up to 3 levels: ./programs/ or ../programs/)
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        {
          allowSameFolder: true,
          rootDir: "src",
          prefix: "@",
          allowedDepth: 3,
        },
      ],

      // React
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-sort-props": "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/prop-types": "off",

      // TODO TO FIX LATER
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "off", // Turned off in favor of unused-imports
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      // Tailwind CSS
      "tailwindcss/classnames-order": ["error"],
      "tailwindcss/enforces-negative-arbitrary-values": ["error"],
      "tailwindcss/enforces-shorthand": ["error"],
      "tailwindcss/no-contradicting-classname": ["error"],
      "tailwindcss/no-custom-classname": [
        "error",
        {
          whitelist: ["rct\\-tree\\-.*"],
        },
      ],

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
    },
  },

  // CommonJS files (bin scripts)
  {
    files: ["bin/**/*.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        process: "readonly",
      },
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "storybook-static/**",
      "vitest.shims.d.ts",
      "vite.config.ts",
    ],
  },
];
