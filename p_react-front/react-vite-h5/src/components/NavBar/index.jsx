import React, { useState } from "react";

import PropTypes from 'prop-types'

import { TabBar } from "zarm";
import { useNavigate } from "react-router-dom";
import CustomIcon from "../CustomIcon";
import { useTranslation } from "react-i18next";
const NavBar = ({showNav}) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState('/')
  const navigateTo = useNavigate()


  const changeTab = (path) => {
    setActiveKey(path)
    navigateTo(path)
  }


  return (
    <TabBar activeKey={activeKey} onChange={changeTab} visible={showNav}>
      <TabBar.Item
        itemKey='/'
        title={t('账单')}
        icon={<CustomIcon type="icon-zhangdan" />}
      />
      <TabBar.Item
        itemKey='/data'
        title={t('统计')}
        icon={<CustomIcon type="icon-tongjifenxi-xiangmubiaogetongji" />}
      />
      <TabBar.Item
        itemKey='/user'
        title={t('我的')}
        icon={<CustomIcon type="icon-31wode" />}
      />
    </TabBar>
  )
}

NavBar.propTypes = {
  showNav: PropTypes.bool
}

export default NavBar