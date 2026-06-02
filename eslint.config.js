import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",

      "no-empty": ["error", { allowEmptyCatch: true }],

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-base-to-string": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",

      "sonarjs/prefer-read-only-props": "off",
      "sonarjs/deprecation": "off",
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/different-types-comparison": "off",
      "sonarjs/slow-regex": "off",
      "sonarjs/assertions-in-tests": "off",
    },
  },
  prettier,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/storybook-static/**",
      "**/.storybook/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/cypress/videos/**",
      "**/cypress/screenshots/**",
      "**/cypress/downloads/**",
    ],
  },
  {
    files: [
      "**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "cypress/**/*.{ts,tsx}",
      "playwright.config.ts",
      "cypress.config.ts",
      "vitest.config.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-empty-function": "off",
      "boundaries/element-types": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/no-identical-functions": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/no-hardcoded-passwords": "off",
      "sonarjs/no-clear-text-protocols": "off",
    },
  },
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/*" },
        { type: "pages", pattern: "src/pages/*" },
        { type: "widgets", pattern: "src/widgets/*" },
        { type: "features", pattern: "src/features/*" },
        { type: "entities", pattern: "src/entities/*" },
        { type: "shared", pattern: "src/shared/*" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["pages", "widgets", "features", "entities", "shared"] },
            { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets", allow: ["widgets", "features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { import: importPlugin },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            { pattern: "@/shared/**", group: "internal", position: "after" },
            { pattern: "@/entities/**", group: "internal", position: "after" },
            { pattern: "@/features/**", group: "internal", position: "after" },
            { pattern: "@/widgets/**", group: "internal", position: "after" },
            { pattern: "@/pages/**", group: "internal", position: "after" },
            { pattern: "@/app/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-cycle": "warn",
      "import/first": "error",
      "import/newline-after-import": "error",
    },
  },
  ...storybook.configs["flat/recommended"]
];
