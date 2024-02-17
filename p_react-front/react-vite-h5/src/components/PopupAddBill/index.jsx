import React, {useState, forwardRef, useRef, useEffect} from "react";
import {
  Popup,
  Button,
  Icon,
  Keyboard,
  Input
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
    console.log("======")
    if(key == "delete") {
      if(amount)
      setAmount((amount+"").slice(0, -1))
      return;
    }
    else if (key == 'ok') {
      addRef.current.close()
      setAmount("")
      if(!props.exitVal) {
        const res = await post("/api/bill/add", {
          amount,
          pay_type: payType == 'expense' ? 1 : 2,
          type_name: currentType.name,
          type_id: currentType.id,
          date,
          remark: remark,
        })
      } else {
        const res = await post("/api/bill/modify", {
          id: props.exitVal.id,
          amount,
          pay_type: payType == 'expense' ? 1 : 2,
          type_name: currentType.name,
          type_id: currentType.id,
          date,
          remark: remark,
        })
      }
      if (props.onReload) props.onReload();
      return;
    } else if(key == '.' && (amount+"").includes('.')) {
      return;
    } else if(key !== '.' && (amount+"").includes('.') && (amount+"").split('.')[1].length >= 2) {
      return;
    }
    else {
      setAmount((amount+"") + key)
      return;
    }
  }
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [currentType, setCurrentType] = useState({})
  const [remark, setRemark] = useState('')
  
  useEffect(async() => {
    const res = await get('/api/type/list')
    if(res.code == 200) {
      setExpense(res.data.list.filter(v => v.type == 2))
      setIncome(res.data.list.filter(v => v.type == 1))
      if(!props.exitVal) {
        if(payType == 'expense')
        setCurrentType(expense[0])
        else
        setCurrentType(income[0])
      }
    }
  }, [payType, show])
  useEffect(() => {
    if(props.exitVal) {
      const {amount, date, pay_type, remark, type_id, type_name, user_id} = props.exitVal
      setRemark(remark)
      setAmount(amount)
      setDate(date)
      setPayType(pay_type === 2 ? 'income' : 'expense')
      setCurrentType({
        type: pay_type,
        id: type_id,
        name: type_name,
        user_id
      })
    }
  },[props.exitVal])
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
            { dayjs(date).format('YYYY-MM-DD') }
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
        <div className={s.remark}>
          <span>备注</span>
          <Input
            className={s.remark_name}
            clearable
            type="text"
            placeholder="请输入备注"
            value={remark}
            onChange={(val) => setRemark(val)}
          />
        </div>
        <Keyboard type="price" onKeyClick={(value) => onKeyClick(value)} />
      </div>
      <PopupDate ref={dateRef} onSelect={selectDate} mode='date'/>
    </div>
  </Popup>
})

export default PopupAddBill