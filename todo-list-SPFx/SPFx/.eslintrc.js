require('@rushstack/eslint-config/patch/modern-module-resolution');
  module.exports = {
    extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
    parserOptions: { tsconfigRootDir: __dirname },
    rules: {
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/typedef": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@microsoft/spfx/no-async-await": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-for-in-array": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "guard-for-in": "off",
      "no-var": "off",
      "prefer-const": "off",
      "react/jsx-no-bind": "off"
    }
  };