import js from "@eslint/js";

export default [
  js.configs.recommended,

  {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },

    env: {
      browser: true,
      node: true,
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];
