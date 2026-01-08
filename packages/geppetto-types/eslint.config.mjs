import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...tseslint.configs.recommended,
  {

  files: ["src/**/*.ts"],
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  }
}];