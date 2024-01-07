import React, { useEffect, useRef, useState } from "react"
import { Icon } from 'zarm'
import s from './style.module.less'
import BillItem from "@/components/BillItem"
import { Pull } from 'zarm'
import Empty from '@/components/Empty'
// import PopupType from '@/components/PopupType'
import { 
  get,
  REFRESH_STATE,
  LOAD_STATE 
} from "@/utils"
const Home = () => {

  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [page_size, setPageSize] = useState(5)
  const [totalPage, setTotalPage] = useState(0)
  const [type_id, setTypeId] = useState('all')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(LOAD_STATE.normal)
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)

  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  useEffect(() => {
    getList(date)
  }, [page, date])
  const getList = async(date = '') => {
    const res = await get(`/api/bill/list?page=${page}&page_size=${page_size}&type_id=${type_id}&date=${date}`)
    if(res.data.page == 1) {
      setDate(res.data.list)
    } else {
      setList(list.concat(res.data.list))
    }
    setTotalExpense(res.data.totalExpense.toFixed(2))
    setTotalIncome(res.data.totalIncome.toFixed(2))
    setTotalPage(res.data.totalPage)
  }
  const refreshData = () => {
    console.log("refreshData")
    setRefreshing(REFRESH_STATE.loading)
    if(page !== 1) {
      setPage(1)
    }else {
      getList(date)
    }
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    // 下滑刷新状态
    setRefreshing(REFRESH_STATE.success);
  }
  const loadData = () => {
    if(page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  const typeRef = useRef(null)
  const select = () => {}
  
  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ {totalExpense}</b></span>
        <span className={s.income}>总收入：<b>¥ {totalIncome}</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left}>
          <span className={s.title}>全部类型<Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
        <div className={s.right}>
          <span className={s.time} >sss<Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
      </div>
    </div>

    <div className={s.content}>
    {
      list.length ? <Pull
        animationDuration={200}
        stayTime={400}
        refresh={{
          state: refreshing,
          handler: refreshData
        }}
        load={{
          state: loading,
          distance: 200,
          handler: loadData
        }}
      >
        {
          list.map((item, index) => <BillItem
            bill={item}
            key={index}
          />)
        }
      </Pull> : <Empty />
    }
    </div>
    {/* <PopupType ref={typeRef} onSelect={select} /> */}
  </div>
}

export default Home