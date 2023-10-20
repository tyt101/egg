'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.get('/user/:id', controller.home.user);
  router.get('/user', controller.home.user);
  router.post('/add', controller.home.add);
  router.post('/add_user', controller.home.addUser);
  router.post('/edit_user', controller.home.editUser);
  router.post('/del_user', controller.home.delUser);
};
