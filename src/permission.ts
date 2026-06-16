// 知识点：导入 router 实例，才能注册全局路由守卫。[出处: JS-模块, VueRouter-守卫]
import router from './router'
// 知识点：NProgress 是页面顶部进度条库，用来提示路由切换或加载中状态。[出处: JS-模块]
import NProgress from 'nprogress'
// 知识点：导入 NProgress 的样式文件，否则进度条可能不可见。[出处: JS-模块]
import 'nprogress/nprogress.css'
// 知识点：Message 是 Element UI 的消息提示组件，可用于错误或状态提示。[出处: JS-模块, ElementUI-组件]
import { Message } from 'element-ui'
// 知识点：Route 是 vue-router 提供的路由对象类型，用于 TypeScript 类型标注。[出处: JS-模块, TS-基础类型, VueRouter-配置]
import { Route } from 'vue-router'
// 知识点：UserModule 是 Vuex 用户模块，这里虽然导入了，但当前守卫实际使用 Cookie 判断登录态。[出处: JS-模块, Vuex-Store]
import { UserModule } from '@/store/modules/user'
// 知识点：js-cookie 用来读写浏览器 Cookie，本项目用 Cookie 保存 token。[出处: JS-模块]
import Cookies from 'js-cookie'

// 知识点：NProgress.configure 用来配置进度条行为，showSpinner=false 表示不显示右侧旋转图标。[出处: JS-对象]
NProgress.configure({ 'showSpinner': false })

// 知识点：beforeEach 是全局前置守卫，每次路由跳转进入页面前都会执行。[出处: VueRouter-守卫]
router.beforeEach(async (to: Route, _: Route, next: any) => {
  // 知识点：NProgress.start() 表示开始显示顶部加载进度条。[出处: JS-对象]
  NProgress.start()

  // 知识点：token 是登录凭证；这里从 Cookie 里读取 token 判断用户是否已登录。[出处: VueRouter-守卫, VueRouter-meta]
  if (Cookies.get('token')) {
    // 知识点：next() 表示放行本次路由跳转，允许进入目标页面。[出处: VueRouter-守卫]
    next()
  } else {
    // 知识点：to.meta 是目标路由的自定义元信息，notNeedAuth 表示该页面不需要登录。[出处: VueRouter-meta]
    if (!to.meta.notNeedAuth) {
      // 知识点：next('/login') 表示中断原跳转并重定向到登录页。[出处: VueRouter-守卫]
      next('/login')
    } else {
      // 知识点：不需要登录的页面，例如 /login 和 /404，没有 token 也允许访问。[出处: VueRouter-守卫]
      next()
    }
  }
})

// 知识点：afterEach 是全局后置守卫，路由已经切换完成后执行。[出处: VueRouter-守卫]
router.afterEach((to: Route) => {
  // 知识点：NProgress.done() 表示结束顶部加载进度条。[出处: JS-对象]
  NProgress.done()
  // 知识点：document.title 会修改浏览器标签页标题，这里使用路由 meta.title。[出处: VueRouter-meta]
  document.title = to.meta.title
})
