import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "node_modules",
      "*.config.js",
      "*.config.ts",
      "vite.config.ts",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  react.configs.flat.recommended,

  reactHooks.configs.flat.recommended,

  reactRefresh.configs.vite,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11y,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      /*
       * ======================
       * TypeScript
       * ======================
       */

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/consistent-type-imports": "error",

      "@typescript-eslint/no-empty-object-type": "warn",

      /*
       * ======================
       * JavaScript
       * ======================
       */

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      "no-debugger": "error",

      eqeqeq: ["error", "always"],

      curly: ["error", "all"],

      "prefer-const": "error",

      "no-var": "error",

      /*
       * ======================
       * React
       * ======================
       */

      "react/react-in-jsx-scope": "off",

      "react/jsx-uses-react": "off",

      "react/prop-types": "off",

      "react/jsx-key": "error",

      "react/self-closing-comp": "warn",

      "react/jsx-no-useless-fragment": "warn",

      /*
       * ======================
       * Imports
       * ======================
       */

      "import/no-duplicates": "error",

      "import/first": "error",

      "import/newline-after-import": ["error", { count: 1 }],

      /*
       * ======================
       * Acessibilidade
       * ======================
       */

      "jsx-a11y/alt-text": "warn",

      "jsx-a11y/anchor-is-valid": "warn",

      "jsx-a11y/no-autofocus": "warn",
    },
  }
);