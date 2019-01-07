import Router from 'koa-router';

import {
  filesRouteProps,
  filesModel,
  filesCrud
} from './files';

const routerControllPros = [
  filesRouteProps
];

let instance;

export const routerControl = (app) => {
  routerControllPros.forEach((routeProperty) => {
    instance = new Router({ prefix: routeProperty.baseUrl });
    routeProperty.routes.forEach((config) => {
      const {
        method = '',
        route = '',
        handlers = []
      } = config;

      const lastHandler = handlers.pop();

      instance[method.toLowerCase()](route, ...handlers, async (ctx) => {
        const hddd = await lastHandler(ctx);
        return hddd;
      });

      app
        .use(instance.routes())
        .use(instance.allowedMethods());
    });
  });
};

export {
  filesModel,
  filesCrud
};
