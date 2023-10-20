const Service = require('egg').Service;
class HomeService extends Service {
  async user() {
    // return {
    //   name: '嘎子',
    //   slogen: '网络的世界太虚拟,你把握不住',
    // };
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
    // return 1;
  }

  async addUser(name) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('list', { name });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async editUser(id, name) {
    const { app } = this;
    try {
      const result = await app.mysql.update('list', { name }, {
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delUser(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('list', { id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService;
