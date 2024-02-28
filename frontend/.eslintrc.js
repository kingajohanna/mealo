module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
  },
  ignorePatterns: ['*.js'],
  overrides: [
    {
      files: ['__tests__/**/*'],
      env: {
        jest: true,
      },
    },
  ],
};
