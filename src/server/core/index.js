import 'babel-polyfill';
import Koa from 'koa';
import config from 'config';
import http from 'http';
import socket from 'socket.io';
import log4js from 'koa-log4';

import loggerInit from './logger';
import dbConfig from './database';
import serverConfig from './server';

const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server);
app.io = io;
loggerInit();

const logger = log4js.getLogger('app');

(async () => {
  try {
    const db = await dbConfig();
    const { connections } = db;
    logger.info(`Connected to ${connections[0].host}:${connections[0].port}/${connections[0].name}`);
    serverConfig(app);
  } catch (error) {
    logger.error('Unable to connect to database');
  }

  await server.listen(config.get('port'));
  logger.info(`Server started on port ${config.get('port')}`);
})();

export default app;
