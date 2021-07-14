module.exports = {
  globals: {
    fastify: 'readonly'
  },
  env: {
    'jest/globals': true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  }
}
