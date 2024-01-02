const Controller = require('egg').Controller;
const moment = require('moment');

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    const { amount, date, pay_type, type_id, type_name, remark } = ctx.request.body;

    if (!amount || !date || !pay_type || !type_id || !type_name) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        date: null,
      };
    }
    try {

      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;

      await ctx.service.bill.add({
        amount,
        date,
        pay_type,
        type_id,
        type_name,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  async list() {
    const { ctx, app } = this;

    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      const _list = list.filter(item => {
        if (type_id !== 'all') {
          return moment(item.date).format('YYYY-MM-DD') === date && type_id === item.type_id;
        }
        return moment(item.date).format('YYYY-MM-DD') === date;
      });
      const listMap = _list.reduce((curArr, item) => {
        // 格式转换
        const date = moment(item.date).format('YYYY-MM-DD');
        if (!curArr.length) {
          curArr.push({
            date,
            bills: [ item ],
          });
        } else if (curArr && curArr.findIndex(item => item.date === date) > -1) {
          const index = curArr.findIndex(item => item.date === date);
          curArr[index].bills.push(item);
        } else {
          curArr.push({
            date,
            bills: [ item ],
          });
        }
        return curArr;
      }, []);

      listMap.sort((a, b) => moment(b.date) - moment(a.date));

      // 分页
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);
      // 总收入
      const totalIncome = _list.reduce((cur, item) => {
        if (item.pay_type === 1) {
          cur += item.amount;
          return cur;
        }
        return cur;
      }, 0);
      // 总支出
      const totalExpense = _list.reduce((cur, item) => {
        if (item.pay_type === 2) {
          cur += Number(item.amount);
          return cur;
        }
        return cur;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalIncome,
          totalExpense,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || [],
        },
      };

    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        date: error,
      };
    }
  }
}
module.exports = BillController;
