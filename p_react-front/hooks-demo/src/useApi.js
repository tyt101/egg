import React, {useEffect, useState} from "react";


const getList = (query) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        console.log('query:', query)
        resolve([6, 7, 8, 9, 10])
      }, 3000);
    } catch (error) {
      reject(error)
    }
  })
}


const useApi = () => {
  const [data, setDate] = useState([1, 2, 3, 4, 5])
  const [query, setQuery] = useState('')


  useEffect(() => {
    (async () => {
      const data = await getList(query)
      console.log('data:', data)
      setDate(data)
    })()
    // [] 表示只会在组件渲染的时候，执行一次
  }, [query])

  return [{data}, setQuery]
}

export default useApi