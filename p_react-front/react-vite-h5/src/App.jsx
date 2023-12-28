// App.jsx
import React, { useState } from 'react'
import { ConfigProvider } from 'zarm'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import routes from '@/router'
function App() {
  return <Router>
     <ConfigProvider primaryColor={'#007fff'}>
      <>
        <Routes>
          {routes.map(route => <Route exact key={route.path} path={route.path} element={<route.component />} />)}
        </Routes>
      </>
     </ConfigProvider>
   </Router>
}

export default App
