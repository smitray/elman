import { Nuxt, Builder } from 'nuxt';
import isDev from 'isdev';
import config from '../../../nuxt.config';

export default async (app) => {
  const nuxt = new Nuxt(config);

  if (isDev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }
  app.use(async (ctx, next) => {
    await next();
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, (promise) => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject);
      });
    });
  });
};
