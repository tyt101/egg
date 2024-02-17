import React, { useEffect, useRef, useState, componentDidMount } from "react"
import s from './style.module.less'
import { Pull, Cell, Button } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  get,
  post,
  REFRESH_STATE,
  LOAD_STATE,
  ICON_TYPE
} from "@/utils"
import dayjs from "dayjs"
import qs from 'query-string'
import Header from "@/components/Header"
import PopupAddBill from '@/components/PopupAddBill'
const Detail = () => {

  const location = useLocation()
  const { id } = qs.parse(location.search)
  const [detail, setDetail] = useState({})
  useEffect(() => {
    getDetail()
  }, []);
  const getDetail = async() => {
    const { data } = await get(`/api/bill/detail?id=${id}`)
    setDetail(data)
  }
  const navigate=useNavigate();
  const handleDel = async() => {
    await post(`/api/bill/del?id=${id}`);
    navigate(-1)
  }
  const addRef = useRef(null)
  const refreshData = () => {
    getDetail()
  }
  const handleEdit = () => {
    addRef.current && addRef.current.show()
  }
  return <div className={s.detail}>
    <Header title="账单详情" />
    <div className={s.card}>
      <div className={s.icons}>
        <span className={s.icon}>
          <CustomIcon type={detail.type_id ? ICON_TYPE[detail?.type_id]?.icon : 1} />
        </span>
        <span>{detail.type_name}</span>
      </div>
      <div className={s.money}>{detail.pay_type == 1 ? '- ':'+ '}{detail.amount}</div>
      <div className={s.date}>
        <span className={s.name}>记录时间</span>
        <span>{dayjs(detail.date).format('YYYY-MM-DD')}</span>
      </div>
      <div className={s.remark}>
        <span className={s.name}>备注</span>
        <span>{detail.remark}</span>
      </div>
      <div className={s.operate}>
        <div className={s.del} onClick={handleDel}>删除</div>
        <div className={s.edit} onClick={handleEdit}>编辑</div>
      </div>
    </div>
    <PopupAddBill ref={addRef} onReload={refreshData} exitVal={detail} />
  </div>
}

export default Detail