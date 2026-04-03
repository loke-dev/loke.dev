import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import eslintJs from "@eslint/js";

export default [
  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".cache/**",
      ".astro/**",
      ".vercel/**",
      "build/**",
      ".env",
      "dist/**",
      "coverage/**",
      "public/**",
      "studio/**",
      "scripts/**",
      "!**/.server",
      "!**/.client"
    ]
  },

  // Base config for all files
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },

  // Apply eslint:recommended to all JS files
  {
    files: ["**/*.{js,cjs,mjs}"],
    ...eslintJs.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        browser: "readonly",
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setImmediate: "readonly",
        MessageChannel: "readonly",
        MSApp: "readonly",
        performance: "readonly",
        queueMicrotask: "readonly",
        reportError: "readonly",
        DOMException: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Headers: "readonly",
        Response: "readonly",
        Request: "readonly",
        AbortController: "readonly",
        FormData: "readonly",
        TextDecoder: "readonly",
        TextEncoder: "readonly",
        TransformStream: "readonly",
        fetch: "readonly",
        sessionStorage: "readonly",
        Node: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
      },
    },
  },

  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
    },
  },

  // TypeScript config
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      "import/internal-regex": "^@/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      "import/no-unresolved": ["error", { ignore: ["^astro:", "^@astrojs/"] }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Please use path aliases (@/) instead of relative imports with '../'"
            }
          ]
        }
      ],
    },
  },

  // Node files
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      globals: {
        node: true,
      },
    },
  },
];
