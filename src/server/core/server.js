import convert from 'koa-convert';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import helmet from 'koa-helmet';
import config from 'config';
import serve from 'koa-static';
import mount from 'koa-mount';
import log4js from 'koa-log4';
import isDev from 'isdev';

import { graphControl } from '@graph';
import { routerControl } from '@api';

import { catchErr, statusMessage } from './error';

import nuxtConfig from './nuxt';

export default (app) => {
  app.keys = config.get('secret');
  app.proxy = true;

  app.use(mount('/public', serve(config.get('paths.static'))));

  app.use(convert.compose(
    catchErr,
    cors(),
    bodyParser({
      multipart: true,
      formLimit: '200mb'
    }),
    helmet(),
    statusMessage
  ));

  if (isDev) {
    app.use(convert(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' })));
  }

  graphControl(app);
  // routerControl(app);

  if (config.get('nuxtBuild')) {
    nuxtConfig(app);
  }
};
