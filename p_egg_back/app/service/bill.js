
const Service = require('egg').Service;
class BillService extends Service {
  async add(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(id) {
    const { app } = this;
    try {
      const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
      const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async detail(id, user_id) {
    const { app } = this;
    try {
      const result = await app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async modify(params) {
    const { app } = this;
    try {
      await app.mysql.update('bill', {
        ...params,
      }, {
        where: {
          id: 1,
        },
      });
      return params.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async del(id) {
    const { app } = this;
    try {
      await app.mysql.delete('bill', {
        id,
      });
      return id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = BillService;
