// App.jsx
import React, { useEffect, useState } from 'react'
import { ConfigProvider } from 'zarm'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom"
import routes from '@/router'
import NavBar from '@/components/NavBar'
function App() {
  // 函数组件中想要执行useLocation, 它必须被Router高阶组件包裹

  const location = useLocation()

  const { pathname } = location
  const needNav = ['/', '/data', '/user']
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    console.log('========:', pathname,needNav.includes(pathname))
    setShowNav(needNav.includes(pathname))
  }, [pathname])

  return <>
     <ConfigProvider primaryColor={'#007fff'}>
      <>
        <Routes>
          {routes.map(route => <Route exact key={route.path} path={route.path} element={<route.component />} />)}
        </Routes>
      </>
     </ConfigProvider>
     <NavBar showNav={showNav} />
   </>
}

export default App
