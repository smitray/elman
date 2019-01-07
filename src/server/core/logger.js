import config from 'config';
import log4js from 'koa-log4';

export default () => log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    app: {
      type: 'dateFile',
      filename: `${config.get('paths.logs')}/app.log`,
      pattern: '-yyyy-MM-dd'
    },
    errors: {
      type: 'dateFile',
      filename: `${config.get('paths.logs')}/errors.log`,
      pattern: '-yyyy-MM-dd'
    }
  },
  categories: {
    default: {
      appenders: [
        'console',
        'app'
      ],
      level: 'all'
    },
    errors: {
      appenders: [
        'errors'
      ],
      level: 'error'
    }
  }
});
