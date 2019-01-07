const shell = require('shelljs');
const config = require('config');

if (config.get('nuxtBuild')) {
  shell.exec('cross-env NODE_ENV=production nuxt build');
}

shell.exec('babel src/server --out-dir dist/server');
