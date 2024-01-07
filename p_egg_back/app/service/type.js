const Service = require('egg').Service;

class typeService extends Service {
  async list(id) {
    const {app} = this
    const sql = `SELECT * from type where user_id=${0} or user_id=${id}`
    const res = await app.mysql.query(sql)
    return res
  }
}

module.exports = typeService