import { jwtVerify } from '@utl';

let token;
let decode;

const isAuthenticated = async (ctx, next) => {
  try {
    token = ctx.request.headers.authorization;
    decode = await jwtVerify(token);
  } catch (e) {
    ctx.throw(401, e.message);
  } finally {
    if (!decode) {
      ctx.throw(401, { message: 'Token has expired' });
    }
    ctx.state.user = decode;
    await next();
  }
};

const isAdmin = async (ctx, next) => {
  if (ctx.state.user.acc_type !== 'admin') {
    ctx.throw(401, { message: 'You do not have permission' });
  }
  await next();
};

export {
  isAuthenticated,
  isAdmin
};
