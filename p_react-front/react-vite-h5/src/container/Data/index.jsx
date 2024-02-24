import React, { useEffect, useRef, useState } from 'react'
import s from './style.module.less'
import PopupDate from '@/components/PopupDate'
import { Button, Icon, Progress } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import dayjs from 'dayjs'
import cx from 'classnames'
import {
  get,
  ICON_TYPE
} from '@/utils'
const Data = () => {
  const selectDate = (val) => {
    setDateLabel(val)
    searchTotalMoneyCondition(val)
  }
  const dateRef = useRef(null)
  const [curState, setCurState] = useState('')
  const handleExpense = () => {
    setPieChart(curState == 'expense' ? expenseList : incomeList);
    if(curState !== 'expense') {
      setCurState('expense') 
      searchTotalMoneyCondition(dateLabel, 1)
    }else {
      setCurState('')
      searchTotalMoneyCondition(dateLabel, 'all')
    }
  }
  const handleIncome = () => {
    if(curState !== 'income') {
      setCurState('income') 
      searchTotalMoneyCondition(dateLabel, 2)
    }else {
      setCurState('')
      searchTotalMoneyCondition(dateLabel, 'all')
    }
  }
  const toggleDate = () => {
    dateRef && dateRef.current.show()
  }
  const [dateLabel, setDateLabel] = useState(dayjs(new Date()).format('YYYY-MM'))
  const [expense, setExpense] = useState(0)
  const [expenseList, setExpenseList] = useState({})
  const [income, setIncome] = useState(0)
  const [incomeList, setIncomeList] = useState({})
  const [listShow, setListShow] = useState([])

  const searchTotalMoneyCondition = async(date, type_id='all') => {
    const {data: {list}} = await get(`/api/bill/list?page=${1}&page_size=${1000}&pay_id=${type_id}&date=${date}`)
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
    setIncomeList(incomeList)
    setExpense(expenseMoney)
    setExpenseList(expenseList)
    
    if(type_id === 'all') {
      setListShow(list[0].bills)
      setPieChart(list[0].bills);
    } else if( type_id == '1') {
      setListShow(expenseList)
      setPieChart(expenseList);
    } else {
      setListShow(incomeList)
      setPieChart(incomeList);
    }
  }
  useEffect(() => {
    searchTotalMoneyCondition(dateLabel)
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart.dispose();
    };
  }, [])

  let proportionChart = null;
  const setPieChart = (data) => {
    if (window.echarts) {
      // 初始化饼图，返回实例。
      proportionChart = echarts.init(document.getElementById('proportion'));
      proportionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // 图例
          legend: {
              top: '5%',
              data: (data || []).map(item => {
                return item.type_name
              })
          },
          series: [
            {
              name: '支出',
              type: 'pie',
              radius: '55%',
              data: data.map(item => {
                return {
                  value: item.amount,
                  name: item.type_name
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
      })
    };
  };
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
        <div className={s.title}>收支构成</div>
        <div>
          <Button size="xs" onClick={handleExpense} className={cx({[s.active]: curState === 'expense'})}>支出</Button>
          <Button size="xs" onClick={handleIncome} className={cx({[s.active]: curState === 'income'})}>收入</Button>
        </div>
      </div>
      <div className={s.list}>
        {listShow.length > 0 ? listShow.map(item => {
          return <li className={s.li} key={item.id}>
          <div>
            <span><CustomIcon className={s.arrow} type={ICON_TYPE[item.type_id]?.icon} /></span>
            <span>{item.type_name}</span>
            <span>{item.pay_type == 1 ? ' - ':' + '}${item.amount}</span>
          </div>
          <div style={{flex: 1}}>
            <span className={s.progress}>
              <Progress
                shape="line"
                percent={20}
                theme={'primary'}
              />
            </span>
          </div>
        </li>
        }): ''}
        
      </div>
      {/* 饼状图 */}
      <div className={s.structure}>
        <div className={s.header}>
          <div className={s.title}>饼状图</div>

        </div>
        <div id="proportion"></div>
      </div>
    </div>
      
  </div>
}

export default Data