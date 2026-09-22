'use strict'

const js = require('@eslint/js')
const importPlugin = require('eslint-plugin-import-x')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: globals.node
    },
    plugins: { 'import-x': importPlugin },
    rules: {
      'import-x/export': 'error',
      'import-x/first': 'error',
      'import-x/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
      'import-x/order': ['error', { 'newlines-between': 'always' }]
    }
  },
  prettierRecommended
]
