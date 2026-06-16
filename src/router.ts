// 知识点：导入 Vue 构造函数，用于安装 Vue Router 插件。[出处: JS-模块, Vue2-插件]
import Vue from "vue";
// 知识点：导入 Vue Router，前端路由负责“地址 -> 页面组件”的映射。[出处: JS-模块, VueRouter-配置]
import Router from "vue-router";
// 知识点：Layout 是后台主布局组件，包含侧边栏、顶部栏和内容区。[出处: JS-模块, Vue2-SFC]
import Layout from "@/layout/index.vue";
// 知识点：从 cookies 工具文件批量导入多个函数，花括号导入对应命名导出。[出处: JS-模块]
import {
  // 知识点：getToken 用于读取 Cookie 中的登录 token。[出处: JS-模块]
  getToken,
  // 知识点：setToken 用于把登录 token 写入 Cookie。[出处: JS-模块]
  setToken,
  // 知识点：removeToken 用于从 Cookie 中删除登录 token。[出处: JS-模块]
  removeToken,
  // 知识点：getStoreId 用于读取当前门店 id。[出处: JS-模块]
  getStoreId,
  // 知识点：setStoreId 用于保存当前门店 id。[出处: JS-模块]
  setStoreId,
  // 知识点：removeStoreId 用于删除当前门店 id。[出处: JS-模块]
  removeStoreId,
  // 知识点：setUserInfo 用于保存用户信息。[出处: JS-模块]
  setUserInfo,
  // 知识点：getUserInfo 用于读取用户信息。[出处: JS-模块]
  getUserInfo,
  // 知识点：removeUserInfo 用于删除用户信息。[出处: JS-模块]
  removeUserInfo
// 知识点：导入语句从 cookies 工具模块结束。[出处: JS-模块]
} from "@/utils/cookies";
// 知识点：导入 Vuex 根 store；当前文件保留了导入，但路由配置主体没有直接使用它。[出处: JS-模块, Vuex-Store]
import store from "@/store";

// 知识点：Vue.use(Router) 安装路由插件，组件里才可以使用 this.$router 和 this.$route。[出处: Vue2-插件, VueRouter-配置]
Vue.use(Router);

// 知识点：new Router 创建路由实例，整个项目共用这个实例管理页面跳转。[出处: VueRouter-配置]
const router = new Router({
  // 知识点：scrollBehavior 控制路由切换后的滚动位置。[出处: VueRouter-配置]
  scrollBehavior: (to, from, savedPosition) => {
    // 知识点：savedPosition 存在时，通常表示浏览器前进/后退，需要恢复之前滚动位置。[出处: VueRouter-配置]
    if (savedPosition) {
      // 知识点：return savedPosition 会让页面回到历史记录中的滚动位置。[出处: VueRouter-配置]
      return savedPosition;
    }
    // 知识点：普通路由跳转时返回顶部，x 是横向滚动，y 是纵向滚动。[出处: VueRouter-配置]
    return { x: 0, y: 0 };
  },
  // 知识点：base 是应用基础路径，Vue CLI 会从环境变量 BASE_URL 读取。[出处: VueRouter-配置]
  base: process.env.BASE_URL,
  // 知识点：routes 是路由表，数组中的每个对象都是一条路由记录。[出处: VueRouter-配置]
  routes: [
    // 知识点：这里开始配置登录页路由记录。[出处: VueRouter-配置]
    {
      // 知识点：path 是浏览器地址路径，访问 /login 会匹配这条路由。[出处: VueRouter-配置]
      path: "/login",
      // 知识点：component 指定该路由要渲染的页面组件；箭头函数 import 是懒加载写法。[出处: VueRouter-配置, JS-Promise]
      component: () =>
        // 知识点：webpackChunkName 给打包后的异步代码块起名，方便构建产物识别。[出处: JS-模块]
        import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
      // 知识点：meta 是路由自定义信息，常用于标题、菜单、权限判断。[出处: VueRouter-meta]
      meta: { title: "苍穹外卖", hidden: true, notNeedAuth: true }
    },
    // 知识点：这里开始配置 404 页面路由记录。[出处: VueRouter-配置]
    {
      // 知识点：访问 /404 时匹配 404 页面。[出处: VueRouter-配置]
      path: "/404",
      // 知识点：这里同样使用懒加载，只有进入 404 页面时才加载组件代码。[出处: VueRouter-配置, JS-Promise]
      component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
      // 知识点：hidden 表示菜单中隐藏，notNeedAuth 表示不需要登录也能访问。[出处: VueRouter-meta]
      meta: { title: "苍穹外卖", hidden: true, notNeedAuth: true }
    },
    // 知识点：这里开始配置后台主框架路由。[出处: VueRouter-配置, VueRouter-出口]
    {
      // 知识点：/ 是后台管理系统主入口路径。[出处: VueRouter-配置]
      path: "/",
      // 知识点：component: Layout 表示先渲染后台主布局。[出处: VueRouter-配置, Vue2-SFC]
      component: Layout,
      // 知识点：redirect 表示访问 / 时自动跳转到 /dashboard。[出处: VueRouter-配置]
      redirect: "/dashboard",
      // 知识点：children 是嵌套路由，子页面会显示在 Layout 内部的 <router-view />。[出处: VueRouter-配置, VueRouter-出口]
      children: [
        // 知识点：这里开始配置工作台子路由。[出处: VueRouter-配置]
        {
          // 知识点：子路由 path 不以 / 开头时，会拼到父路由后面，形成 /dashboard。[出处: VueRouter-配置]
          path: "dashboard",
          // 知识点：懒加载工作台页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/index.vue"),
          // 知识点：name 是路由名称，可用于命名跳转或缓存识别。[出处: VueRouter-配置]
          name: "Dashboard",
          // 知识点：meta 内的信息会被侧边栏、面包屑、标题等逻辑读取。[出处: VueRouter-meta]
          meta: {
            // 知识点：title 是页面标题，也常作为左侧菜单显示文本。[出处: VueRouter-meta]
            title: "工作台",
            // 知识点：icon 是菜单图标字段，侧边栏组件会读取它决定显示哪个图标。[出处: VueRouter-meta]
            icon: "dashboard",
            // 知识点：affix 常用于标签栏固定页签，表示工作台固定显示。[出处: VueRouter-meta]
            affix: true
          }
        }, {
          // 知识点：以 / 开头的子路由会被当作绝对路径，这里访问地址是 /statistics。[出处: VueRouter-配置]
          path: "/statistics",
          // 知识点：懒加载数据统计页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/statistics/index.vue"),
          // 知识点：meta 配置数据统计菜单标题和图标。[出处: VueRouter-meta]
          meta: {
            // 知识点：title 显示为“数据统计”。[出处: VueRouter-meta]
            title: "数据统计",
            // 知识点：icon-statistics 是项目自定义图标名。[出处: VueRouter-meta]
            icon: "icon-statistics"
          }
        },
        // 知识点：这里开始配置订单管理页面。[出处: VueRouter-配置]
        {
          // 知识点：访问 /order 会进入订单管理页面。[出处: VueRouter-配置]
          path: "order",
          // 知识点：懒加载订单详情列表页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/orderDetails/index.vue"),
          // 知识点：订单页面的菜单元信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：菜单或标题显示“订单管理”。[出处: VueRouter-meta]
            title: "订单管理",
            // 知识点：侧边栏使用 icon-order 图标。[出处: VueRouter-meta]
            icon: "icon-order"
          }
        },
        // 知识点：这里开始配置套餐管理页面。[出处: VueRouter-配置]
        {
          // 知识点：访问 /setmeal 会进入套餐管理页面。[出处: VueRouter-配置]
          path: "setmeal",
          // 知识点：懒加载套餐列表页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/setmeal/index.vue"),
          // 知识点：套餐页面的菜单元信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：菜单或标题显示“套餐管理”。[出处: VueRouter-meta]
            title: "套餐管理",
            // 知识点：侧边栏使用 icon-combo 图标。[出处: VueRouter-meta]
            icon: "icon-combo"
          }
        },
        // 知识点：这里开始配置菜品管理页面。[出处: VueRouter-配置]
        {
          // 知识点：访问 /dish 会进入菜品管理页面。[出处: VueRouter-配置]
          path: "dish",
          // 知识点：懒加载菜品列表页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/dish/index.vue"),
          // 知识点：菜品页面的菜单元信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：菜单或标题显示“菜品管理”。[出处: VueRouter-meta]
            title: "菜品管理",
            // 知识点：侧边栏使用 icon-dish 图标。[出处: VueRouter-meta]
            icon: "icon-dish"
          }
        },
        // 知识点：这里开始配置添加菜品页面。[出处: VueRouter-配置]
        {
          // 知识点：/dish/add 是绝对路径，通常通过菜品列表页按钮跳转进入。[出处: VueRouter-配置]
          path: "/dish/add",
          // 知识点：懒加载添加菜品页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/dish/addDishtype.vue"),
          // 知识点：添加页的 meta 通常设置 hidden，避免出现在左侧菜单。[出处: VueRouter-meta]
          meta: {
            // 知识点：页面标题显示“添加菜品”。[出处: VueRouter-meta]
            title: "添加菜品",
            // 知识点：hidden 为 true 表示不在左侧菜单展示，通常通过按钮跳转进入。[出处: VueRouter-meta]
            hidden: true
          }
        },

        // 知识点：这里开始配置分类管理页面。[出处: VueRouter-配置]
        {
          // 知识点：访问 /category 会进入分类管理页面。[出处: VueRouter-配置]
          path: "category",
          // 知识点：懒加载分类管理页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/category/index.vue"),
          // 知识点：分类页面的菜单元信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：菜单或标题显示“分类管理”。[出处: VueRouter-meta]
            title: "分类管理",
            // 知识点：侧边栏使用 icon-category 图标。[出处: VueRouter-meta]
            icon: "icon-category"
          }
        },
        // 知识点：这里开始配置员工管理页面。[出处: VueRouter-配置]
        {
          // 知识点：访问 /employee 会进入员工管理页面。[出处: VueRouter-配置]
          path: "employee",
          // 知识点：懒加载员工管理页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/employee/index.vue"),
          // 知识点：员工页面的菜单元信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：菜单或标题显示“员工管理”。[出处: VueRouter-meta]
            title: "员工管理",
            // 知识点：侧边栏使用 icon-employee 图标。[出处: VueRouter-meta]
            icon: "icon-employee"
          }
        },

        // 知识点：这里开始配置添加员工页面。[出处: VueRouter-配置]
        {
          // 知识点：/employee/add 是绝对路径，通常从员工列表页进入。[出处: VueRouter-配置]
          path: "/employee/add",
          // 知识点：懒加载添加员工页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "dashboard" */ "@/views/employee/addEmployee.vue"),
          // 知识点：添加员工页的 meta 信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：页面标题显示“添加员工”。[出处: VueRouter-meta]
            title: "添加员工",
            // 知识点：添加/编辑类页面通常不出现在菜单中，只能从列表页点按钮进入。[出处: VueRouter-meta]
            hidden: true
          }
        },

        // 知识点：这里开始配置添加套餐页面。[出处: VueRouter-配置]
        {
          // 知识点：/setmeal/add 是绝对路径，通常从套餐列表页进入。[出处: VueRouter-配置]
          path: "/setmeal/add",
          // 知识点：懒加载添加套餐页面组件。[出处: VueRouter-配置, JS-Promise]
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/views/setmeal/addSetmeal.vue"),
          // 知识点：添加套餐页的 meta 信息。[出处: VueRouter-meta]
          meta: {
            // 知识点：页面标题显示“添加套餐”。[出处: VueRouter-meta]
            title: "添加套餐",
            // 知识点：添加套餐页面隐藏菜单入口，避免左侧菜单过长。[出处: VueRouter-meta]
            hidden: true
          }
        }
      ]
    },
    // 知识点：这里配置兜底路由，处理所有未匹配地址。[出处: VueRouter-配置]
    {
      // 知识点：path: "*" 表示匹配任意路径，通常放在路由表最后。[出处: VueRouter-配置]
      path: "*",
      // 知识点：redirect: "/404" 表示未匹配页面统一跳转 404。[出处: VueRouter-配置]
      redirect: "/404",
      // 知识点：兜底路由不应该显示在菜单里，所以 hidden 为 true。[出处: VueRouter-meta]
      meta: { hidden: true }
    }
  ]
});

// 知识点：导出 router 实例，main.ts 注入它，permission.ts 也会用它注册守卫。[出处: JS-模块, VueRouter-配置]
export default router;
