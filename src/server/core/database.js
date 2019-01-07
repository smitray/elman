import mongoose from 'mongoose';
import config from 'config';
import log4js from 'koa-log4';

const logger = log4js.getLogger('app');

export default () => {
  mongoose.connect(
    `${config.get('mongodb.uri')}:${config.get('mongodb.port')}/${config.get('mongodb.db')}`,
    config.get('mongodb.options')
  );
  return new Promise((resolve, reject) => {
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => {
        logger.info('Database connection closed.');
      })
      .once('open', () => resolve(mongoose));
  });
};
