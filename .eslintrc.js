module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['plugin:vue/essential', 'standard', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: ['vue'],
  rules: {
    // 'comma-dangle': ['error', 'always-multiline'],
    // quotes: ['error', 'double', 'single'],
    camelcase: 'off',
    'array-callback-return': 'off',
    // semi: ['error', 'always'],
    'no-async-promise-executor': 'off',
    'no-console': 'warn',
  },
}
