import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'
import s from './style.module.less'
import { Cell, SwipeAction, Button } from "zarm";
import CustomIcon from '@/components/CustomIcon'
import { ICON_TYPE } from '@/utils'
const BillItem = ({bill}) => {

  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)

  useEffect(() => {
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills])
  return <div className={s.item}>
    <div className={s.header}>
      <div className={s.date}>{bill.curDate}</div>
      <div className={s.money}>
        <span><b>支</b>¥{expense}</span>
        <span><b>收</b>¥{income}</span>
      </div>
    </div>
    {
      bill && bill.bills.map(item => <SwipeAction
        key={item.id}
        right={[
          <Button className={s.Button} size="lg" key={1} shape="rect" theme="primary">
            删除
          </Button>
        ]}
      >
        <Cell
        className={s.bill}
        
        title={
          <>
          <CustomIcon className={s.itemIcon} type={item.type_id ? ICON_TYPE[item?.type_id]?.icon : 1} />
          <span>{item.type_name}</span>
          </>
        }
        description={
          <span>{item.pay_type === 1 ? '-' : '+'} {item.amount}</span>
        }
        help={
          <div>{item.date}</div>
        }
      ></Cell>
      </SwipeAction>)
    }
  </div>
}


BillItem.propTypes = {
  bill: PropTypes.object
}

export default BillItem