import React, { useEffect, useRef, useState } from 'react'
import s from './style.module.less'
import PopupDate from '@/components/PopupDate'
import { Button, Icon } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import dayjs from 'dayjs'
import {
  get
} from '@/utils'
const Data = () => {
  const selectDate = (val) => {
    setDateLabel(val)
    searchTotalMoneyCondition(val)
  }
  const dateRef = useRef(null)
  const handleExpense = () => {}
  const handleIncome = () => {}
  const toggleDate = () => {
    dateRef && dateRef.current.show()
  }
  const [dateLabel, setDateLabel] = useState(dayjs(new Date()).format('YYYY-MM'))
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const searchTotalMoneyCondition = async(date) => {
    const {data: {list}} = await get(`/api/bill/list?page=${1}&page_size=${1000}&date=${date}`)
    let incomeList = []
    let expenseList = []
    list.forEach(item => {
      incomeList = item?.bills.filter(bill => {
        return bill.pay_type == 2
      })
    })
    const incomeMoney = incomeList.reduce((pre, cur) => {
      return pre + cur.amount
    }, 0)
    list.forEach(item => {
      expenseList = item?.bills.filter(bill => {
        return bill.pay_type == 1
      })
    })
    const expenseMoney = expenseList.reduce((pre, cur) => {
      return pre + cur.amount
    }, 0)
    setIncome(incomeMoney)
    setExpense(expenseMoney)
  }
  useEffect(() => {
    searchTotalMoneyCondition(dateLabel)
  }, [])
  return <div className={s.data}>
    <div className={s.card}>
      <div className={s.content}>
        <div className={s.typeWrap}  onClick={toggleDate}>{dateLabel} | <CustomIcon className={s.arrow} type="icon-guanbi" /></div>
        <div className={s.money}>
          <div className={s.expense}>共支出:  {expense}元</div>
          <div className={s.income}>共收入:  {income}元</div>
        </div>
      </div>
      <PopupDate ref={dateRef} onSelect={selectDate} mode='month' />
    </div>
    <div className={s.card}>
      <div className={s.header}>
        <div>收支构成</div>
        <div>
          <Button size="xs" onClick={handleExpense}>支出</Button>
          <Button size="xs" onClick={handleIncome}>收入</Button>
        </div>
      </div>
      <div className={s.list}>
        <li>
          <div>
            <span><CustomIcon /></span>
            <span>购物</span>
            <span>$124</span>
            <span>progress</span>
          </div>
          <div>
            58%
          </div>
        </li>
      </div>
    </div>
  </div>
}

export default Data