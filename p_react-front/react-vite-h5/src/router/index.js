import Home from "@/container/Home"
import Data from "@/container/Data"
import User from '@/container/User'
import Index from '@/container/Index'

const routes = [{
  path: '/',
  component: Home,
},{
  path: '/data',
  component: Data,
},{
  path: '/user',
  component: User
},{
  path: '/index',
  component: Index
}]


export default routes