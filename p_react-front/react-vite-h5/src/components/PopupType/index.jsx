import React, {forwardRef, useState, useEffect} from "react";
import PropTypes from "prop-types";
import { get } from '@/utils'
import { Popup, Button, Icon} from 'zarm'
import s from './style.module.less'
import cx from 'classnames'
const PopupType = forwardRef(({onSelect, mode = 'date'}, typeRef) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState('all');
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: { list } } = await get('/api/type/list')
      setExpense(list.filter(i => i.type == 2))
      setIncome(list.filter(i => i.type == 1))
    })()
  }, [])

  if(typeRef) {
    typeRef.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }
  const toggle = (label) => {
    console.log(label)
  }
  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    onSelect(item)
  };
  return <>
  <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    afterOpen={() => console.log('打开')}
    afterClose={() => console.log('关闭')}
  >
    <div className={s.popupType}>
      <div className={s.header}>
        请选择类型
        <Icon type="wrong" className={s.cross} onClick={() => setShow(false)} />
      </div>
      <div className={s.content}>
        <div 
          onClick={() => choseType({ id: 'all' })} 
          className={cx({ [s.all]: true, [s.active]: active == 'all' })}
        >
            全部类型
        </div>
        <div className={s.title}>支出</div>
        <div className={s.expenseWrap}>
          {
            expense.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[s.active]: active == item.id})} >{ item.name }</p>)
          }
        </div>
        <div className={s.title}>收入</div>
        <div className={s.incomeWrap}>
          {
            income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[s.active]: active == item.id})} >{ item.name }</p>)
          }
        </div>
      </div>
    </div>
  </Popup>
  </>
})

PopupType.propTypes = {
  onSelect: PropTypes.func, // 选择后的回调
}

export default  PopupType