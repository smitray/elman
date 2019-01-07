import { has } from 'lodash/fp';
import isDev from 'isdev';
import log4js from 'koa-log4';

const logger = log4js.getLogger('app');

export const catchErr = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (isDev) {
      logger.error(`Error: ${err.toString()}`);
    }
    ctx.body = {
      message: err.toString()
    };
  }
};

const statusMsg = {
  400: 'Entity not found and will not proceed',
  401: 'Not authorized',
  403: 'Forbidden',
  404: 'Resource not found',
  405: 'Method not allowed',
  409: 'Record conflict',
  422: 'Unprocessable entity',
  429: 'Too many requests.'
};

export const statusMessage = async (ctx, next) => {
  await next();

  if (has(ctx.status, statusMsg)) {
    const { status } = ctx;
    ctx.body = {
      message: statusMsg[status]
    };
    ctx.status = status;
  }
};
