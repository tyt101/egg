import Home from "@/container/Home"
import Data from "@/container/Data"
import User from '@/container/User'
import Index from '@/container/Index'
import Login from "@/container/Login"

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
},{
  path: '/login',
  component: Login
}]


export default routes