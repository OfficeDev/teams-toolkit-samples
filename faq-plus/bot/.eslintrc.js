module.exports = {
  env: {
      browser: true,
      es6: true,
      node: true,
  },
  parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
  },
  extends: [
      "plugin:@typescript-eslint/recommended",
      "prettier", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
      "@typescript-eslint/eslint-plugin",
  ],
  rules: {
      quotes: ["error", "double", { "allowTemplateLiterals": true }],
      semi: ["error", "always"],
  },
};