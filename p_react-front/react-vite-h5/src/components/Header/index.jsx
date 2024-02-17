import React from "react";
import { useNavigate } from 'react-router-dom'
import s from "./style.module.less"
import PropTypes from 'prop-types'
import CustomIcon from '@/components/CustomIcon'
const Header = ({title}) => {
  const navigateTo = useNavigate()
  return <div className={s.header}>
    <div className={s.icon} onClick={() => navigateTo(-1)}><CustomIcon type="icon-guanbi" /></div>
    <div className={s.title}>{title}</div>
  </div>
}
Header.propTypes = {
  title: PropTypes.string
}
export default Header