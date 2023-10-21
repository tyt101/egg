'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  // 测试
  router.get('/api/user/test', _jwt, controller.user.test);
  // 注册
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);

};
