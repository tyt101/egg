import React, { useEffect, useState } from "react"
import { Icon } from 'zarm'
import s from './style.module.less'
import BillItem from "@/components/BillItem"
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
  const getList = async(date = '') => {
    const res = await get('/api/bill/list', {
      page: 1,
      page_size,
      type_id,
      date,
    })
    setList(res.data.list)
    setTotalPage(res.data.totalPage)
  }
  useEffect(() => {
    getList()
  }, [page])
  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ 200</b></span>
        <span className={s.income}>总收入：<b>¥ 500</b></span>
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
        list.map((item, index) => <BillItem bill={item} key={index} />)
      }
    </div>
  </div>
}

export default Home