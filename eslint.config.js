// https://docs.expo.dev/guides/using-eslint/
// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // ensures TypeScript resolver works
      },
    },
    settings: {
      "import/resolver": {
        typescript: {}, // <-- makes ESLint recognize '@env'
      },
    },
  },
]);
