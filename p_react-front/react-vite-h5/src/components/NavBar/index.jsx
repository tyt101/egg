import React, { useState } from "react";

import PropTypes from 'prop-types'

import { TabBar } from "zarm";
import { useNavigate } from "react-router-dom";

import s from './style.module.less'

const NavBar = ({showNav}) => {
  const [activeKey, setActiveKey] = useState('/')
  const navigateTo = useNavigate()


  const changeTab = (path) => {
    setActiveKey(path)
    navigateTo(path)
  }


  return (
    <TabBar activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey='/'
        title='账单'
      />
      <TabBar
        itemKey='/data'
        title='统计'
      />
      <TabBar 
        itemKey='/user'
        title='我的'
      />
    </TabBar>
  )
}

NavBar.PropTypes = {
  showNav: PropTypes.bool
}

export default NavBar