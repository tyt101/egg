'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  // 测试
  router.get('/api/user/test', _jwt, controller.user.test);

  /** login controller */
  // register
  router.post('/api/user/register', controller.user.register);
  // login
  router.post('/api/user/login', controller.user.login);

  /** user info */
  // getUserInfo
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);
  // editUserInfo
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);


  /** common interface */
  // upload
  router.post('/api/upload/upload', controller.upload.upload);

  /** bill controller */
  // add bill
  router.post('/api/bill/add', _jwt, controller.bill.add);
  // get bill list
  router.get('/api/bill/list', _jwt, controller.bill.list);
  // get single bill detail
  router.get('/api/bill/detail', _jwt, controller.bill.detail);
  // modify single bill info
  router.post('/api/bill/modify', _jwt, controller.bill.modify);
  // delete single bill
  router.post('/api/bill/del', _jwt, controller.bill.del);


  /** table */
  router.get('/api/bill/data', _jwt, controller.bill.data);

  /** type */
  router.get('/api/type/list', _jwt, controller.type.list);
};
