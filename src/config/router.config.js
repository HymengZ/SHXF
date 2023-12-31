import { UserLayout, TabLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [

  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [

    ]

  },

  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Home')
  },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/Register'),
      },
      {
        path: 'invitation',
        name: 'invitation',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/invitation/'),
      },
      {
        path: 'insideRegister',
        name: 'insideRegister',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/inside/Register'),
      },
      {
        path: 'outsideRegister',
        name: 'outsideRegister',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/outside/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/RegisterResult')
      },
      {
        path: 'alteration',
        name: 'alteration',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/alteration/Alteration')
      },
    ]
  },
  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // {
      //   path: '/account/center',
      //   name: 'account-center',
      //   component: () => import(/* webpackChunkName: "userCenter" */  '@/views/account/center/Index'),
      //   meta: { title: '用户中心' },
      // },
      // {
      //   path: '/account/setting',
      //   name: 'account-settings-base',
      //   component: () => import(/* webpackChunkName: "userSetting" */  '@/views/account/settings/Index'),
      //   meta: { title: '用户中心' },
      // },
    ]

  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
