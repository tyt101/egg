import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useApi from './useApi'

function Child({ data }) {
  useEffect(() => {
    console.log("data:", data)
  }, [data])

  return <div>子组件</div>
}
function Child2({ callback }) {
  useEffect(() => {
    callback()
  }, [callback])

  return <div>子组件</div>
}
function App() {

  const [{data}, setQuery] = useApi()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [keyword, setKeyWord] = useState('')
  // useMemo: 把父组件需要传递的参数做了一个标记，无论父组件其他状态更新任何值，都不会影响传递给子组件的对象
  const data1 = useMemo(() => ({
    name,
    phone
  }), [name, phone])

  const callback = useCallback(() => {
      console.log('我是callback函数', keyword)
  }, [keyword])
  return (
    <div className="App">
      {
        data.map((item, index) => <div key={index}>{item}</div>)
      }
      <input type="text" placeholder='请输入query值' onChange={ (e) => setQuery(e.target.value) } />

      <div>========================================================================================================</div>
      <div>keyword: {keyword}</div>
      <input type="text" placeholder='请输入name值' onChange={ (e) => setName(e.target.value) } />
      <input type="text" placeholder='请输入phone值' onChange={ (e) => setPhone(e.target.value) } />
      <input type="text" placeholder='请输入keyword值' onChange={ (e) => setKeyWord(e.target.value) } />

      <Child data={data1} />
      <Child2 callback={callback} />
    </div>
  )
}

export default App
