module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['plugin:vue/essential', 'standard', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@babel/eslint-parser',
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
    'max-len': [
      'error',
      5000,
      2,
      {
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
      },
    ],
    'vue/max-attributes-per-line': 'off',
    'vue/single-attribute-per-line': 'off',
    'space-before-function-paren': 'off',
  },
}
