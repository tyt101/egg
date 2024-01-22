import React, {useState, forwardRef, useRef, useEffect} from "react";
import {
  Popup,
  Button,
  Icon,
  Keyboard
} from 'zarm'
import cx from 'classnames'
import PopupDate from '@/components/PopupDate'
import dayjs from 'dayjs'
import s from './style.module.less'
import CustomIcon from '@/components/CustomIcon'
import { 
  get,
  post,
  ICON_TYPE
} from "@/utils"
const PopupAddBill = forwardRef((props, addRef) => {
  // 控制弹窗显示隐藏的黄金代码！！！
  const [show, setShow] = useState(false)

  if(addRef) {
    addRef.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }
  const [payType, setPayType] = useState('expense')
  const changePayType = (type) => {
    setPayType(type)
  }
  const dateRef = useRef();
  const [date, setDate] = useState(new Date())
  const selectDate = (date) => {
    setDate(date)
  }

  const [amount, setAmount] = useState("")
  const onKeyClick = async(key) => {
    if(key == "delete") {
      if(amount)
      setAmount(amount.slice(0, -1))
      return;
    }
    else if (key == 'ok') {
      addRef.current.close()
      setAmount("")
      const res = await post("/api/bill/add", {
        amount,
        pay_type: payType == 'expense' ? 1 : 2,
        type_name: currentType.name,
        type_id: currentType.id,
        date,
        user_id: 1,
        remark: 'remark',
      })
      if (props.onReload) props.onReload();
      return;
    } else if(key == '.' && amount.includes('.')) {
      return;
    } else if(key !== '.' && amount.includes('.') && amount.split('.')[1].length >= 2) {
      return;
    }
    else {
      setAmount(amount + key)
      return;
    }
  }
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [currentType, setCurrentType] = useState({})

  useEffect(async() => {
    const res = await get('/api/type/list')
    if(res.code == 200) {
      setExpense(res.data.list.filter(v => v.type == 2))
      setIncome(res.data.list.filter(v => v.type == 1))
      if(payType == 'expense')
      setCurrentType(expense[0])
      else
      setCurrentType(income[0])
    }
  }, [payType, show])
  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
  >
    <div className="popup-box">
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}><CustomIcon type="icon-guanbi" /></span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span className={cx({[s.active_color] : payType == 'expense', [s.active_border] : payType == 'expense'})} onClick={() => changePayType('expense')}>支出</span>
            <span className={cx({[s.active_color] : payType == 'income', [s.active_border] : payType == 'income'})} onClick={() => changePayType('income')}>收入</span>
          </div>
          <div
            className={s.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            { dayjs(date).format('MM-DD') }
            <CustomIcon className={s.arrow} type="icon-xia-" />
          </div>
        </div>
        <div className={s.money}>
          <span className={s.sufix}>¥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.scroll}>
        {
          (payType == 'expense' ? expense : income).map(item => {
            return <div className={s.iconfontWrap} onClick={() => setCurrentType(item)} key={item.id}>
              <div className={cx({[s.expense]: payType == 'expense', [s.income]: payType == 'income'})}>   
                <CustomIcon className={s.iconfont} type={ICON_TYPE[item?.id]?.icon} />
              </div>
              <div className={cx({[s.name]: true,[s.active_color]: currentType?.id == item.id})}>{item.name}</div>
            </div>
          })
        }
        </div>
        <Keyboard type="price" onKeyClick={(value) => onKeyClick(value)} />
      </div>
      <PopupDate ref={dateRef} onSelect={selectDate} mode='month'/>
    </div>
  </Popup>
})

export default PopupAddBill