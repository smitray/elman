const config = require('config');
const isdev = require('isdev');

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    'node': true,
    'browser': true
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  plugins: [
    'import',
    'vue'
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '~': config.get('paths.app.client'),
              '@': config.get('paths.app.client')
            }
          }
        }
      },
      'babel-module': {
        '@utl': './src/server/utilities',
        '@graph': './src/server/graphql',
        '@mid': './src/server/middlewares',
        '@api': './src/server/api'
      }
    }
  },
  rules: {
    'comma-dangle': [
      'error', {
        'functions': 'ignore'
      }
    ],
    'import/no-extraneous-dependencies': [
      'error', {
        'devDependencies': true,
        'optionalDependencies': true
      }
    ],
    'no-param-reassign': [
      'error', {
        'props': false
      }
    ],
    'no-underscore-dangle': [
      'error', {
        'allow': [
          '_id'
        ]
      }
    ],
    'no-debugger': !isdev ? 2 : 0,
    'no-console': !isdev ? 2 : 0
  }
};
