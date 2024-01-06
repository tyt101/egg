import axios from "./axios";
export const get = axios.get
export const post = axios.post
export const put = axios.put
export const del = axios.delete
export const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5, // 加载失败
};

export const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5, // 加载完成（无新数据）
};

export const ICON_TYPE = {
  // 购物
  1: {
    icon: 'icon-icon_shopping',
  },
  // 奖金
  2: {
    icon: 'icon-icon_bonus'
  },
  // 衣服
  3: {
    icon: 'icon-icon_clothes'
  },
  // 食物
  4: {
    icon: 'icon-icon_food'
  },
  // 捐款
  5: {
    icon: 'icon-icon_donate'
  },
  // 租房
  6: {
    icon: 'icon-icon_houserent'
  },
  // 兴趣
  7: {
    icon: 'icon-icon_intrest'
  },
  // 加油
  8: {
    icon: 'icon-icon_fuel'
  },
  // 娱乐
  9: {
    icon: 'icon-icon_entertainment'
  },
  // 其他
  10: {
    icon: 'icon-icon_other'
  },
  // 医疗
  11: {
    icon: 'icon-icon_medicine'
  },
  // 薪水
  12: {
    icon: 'icon-icon_salary'
  },
  // 化妆品
  13: {
    icon: 'icon-icon_makeup'
  },
  // 学习
  14: {
    icon: 'icon-icon_study'
  },
  // 交通
  15: {
    icon: 'icon-icon_traffic'
  },
  // 抽烟
  16: {
    icon: 'icon-icon_smoke_wine'
  },
  // 投资
  17: {
    icon: 'icon-icon_investment'
  }
}