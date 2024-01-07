const Controller = require('egg').Controller;

class typeController extends Controller {
  async list() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if(!decode) return;
    const user_id = decode.id

    try {
      const result = await ctx.service.type.list(user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          list: result,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }
}

module.exports = typeController