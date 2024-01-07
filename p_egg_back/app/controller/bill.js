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
    const { date = '', page = 1, page_size = 5, type_id = 'all' } = ctx.request.query;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      const _list = list.filter(item => {
        if (type_id !== 'all') {
          return type_id == item.type_id;
        }
        return item;
      });
      const __list = _list.filter(item => {
        if (!date) {
          return item;
        }
        return moment(item.date).format('YYYY-MM') === moment(date).format('YYYY-MM');
      });

      const listMap = __list.reduce((curArr, item) => {
        // 格式转换
        const curDate = item.date && moment(item.date).format('YYYY-MM');
        if (!curArr.length) {
          curArr.push({
            curDate,
            bills: [ item ],
          });
        } else if (curArr.length && curDate && curArr.findIndex(item1 => item1.curDate === curDate) > -1) {
          const index = curArr.findIndex(item => item.curDate === curDate);
          curArr[index].bills.push(item);
        } else {
          curArr.push({
            curDate,
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
          totalCount: listMap.length,
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

  async detail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.request.query;

    const token = ctx.request.header.authorization;

    const decode = app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;

    if (!id) {
      ctx.body = {
        code: 400,
        msg: '订单id不能为空',
        data: null,
      };
    }
    try {
      const detail = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  async modify() {
    const { ctx, app } = this;
    const { id, pay_type, amount, date, type_id, type_name, remark } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: 'id 不能为空',
        data: null,
      };
    }
    const row = {};
    if (pay_type) {
      row.pay_type = pay_type;
    }
    if (amount) row.amount = amount;
    if (date) row.date = date;
    if (type_id) row.type_id = type_id;
    if (type_name) row.type_name = type_name;
    if (remark) row.remark = remark;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const result = await ctx.service.bill.modify({
        id,
        ...row,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: result,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  async del() {
    const { ctx, app } = this;

    const { id = '' } = ctx.request.query;

    if (!id) {
      ctx.body = {
        code: 400,
        msg: 'id不能为空',
        data: null,
      };
    }

    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;

    try {
      const result = await ctx.service.bill.del(id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: result,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  async data() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const { date = '' } = ctx.request.query;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;

    try {
      const result = await ctx.service.bill.list(user_id);
      const start = moment(date).startOf('month').unix() * 1000; // 选择月份，月初时间
      const end = moment(date).endOf('month').unix() * 1000; // 选择月份，月末时间
      // eslint-disable-next-line array-callback-return
      const _data = result.filter(item => {
        if (moment(item.date) > start && moment(item.date) < end) {
          return item;
        }
      });

      // 总支出
      const total_expense = _data.reduce((arr, cur) => {
        if (cur.pay_type === 1) {
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);

      // 总收入
      const total_income = _data.reduce((arr, cur) => {
        if (cur.pay_type === 2) {
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);

      // 总数据
      let total_data = _data.reduce((arr, cur) => {
        const index = arr.findIndex(item => cur.type_id === item.type_id);
        if (index > 0) {
          arr[index].amount += Number(cur.amount);
        } else {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            amount: +cur.amount,
          });
        }
        return arr;
      }, []);
      total_data = total_data.map(item => {
        item.amount = +((+item.amount).toFixed(2));
        return item;
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          total_expense,
          total_income,
          total_data,
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
module.exports = BillController;
