// 知识点：main.ts 是 Vue CLI 项目的入口文件，浏览器加载应用时会从这里启动。[出处: Vue2-实例]
// 知识点：从 vue 包中导入 Vue 构造函数，后面用它创建根实例、安装插件、挂载原型属性。[出处: JS-模块, Vue2-实例]
import Vue from 'vue'
// 知识点：导入 Vue Router 构造对象，这里主要用于修改 Router.prototype.push 的默认行为。[出处: JS-模块, VueRouter-配置]
import Router from 'vue-router'
// 知识点：normalize.css 用来抹平不同浏览器的默认样式差异，是全局 CSS 引入。[出处: JS-模块]
import 'normalize.css'
// 知识点：ElementUI 是组件库插件，安装后页面可以使用 el-button、el-table 等组件。[出处: JS-模块, ElementUI-组件]
import ElementUI from 'element-ui'
// 知识点：SvgIcon 是 svg 图标插件，安装后可以在模板中使用 svg-icon 组件。[出处: JS-模块, Vue2-插件]
import SvgIcon from 'vue-svgicon'
// 知识点：VueAreaLinkage 是地区联动插件，安装后可以使用它提供的地区选择能力。[出处: JS-模块, Vue2-插件]
import VueAreaLinkage from 'vue-area-linkage'
// 知识点：moment 是日期时间处理库，项目里常用来格式化日期。[出处: JS-模块]
import moment from 'moment'
// 知识点：引入 Element UI 的 SCSS 变量文件，用于覆盖组件库默认主题样式。[出处: JS-模块, ElementUI-组件]
import '@/styles/element-variables.scss'
// 知识点：引入项目全局样式，所有页面都会受到这里样式的影响。[出处: JS-模块, Vue2-SFC]
import '@/styles/index.scss'
// 知识点：引入首页或后台布局相关的全局样式。[出处: JS-模块, Vue2-SFC]
import '@/styles/home.scss'
// 知识点：引入地区联动插件自带样式，否则插件界面可能没有正确样式。[出处: JS-模块, Vue2-插件]
import 'vue-area-linkage/dist/index.css'

// 知识点：导入 ECharts 图表库，后面挂到 Vue 原型上供组件使用。[出处: JS-模块]
import * as echarts from 'echarts'
// 知识点：引入业务系统通用样式，例如后台系统的公共页面样式。[出处: JS-模块, Vue2-SFC]
import '@/styles/newRJWMsystem.scss'
// 知识点：引入 iconfont 字体图标样式，页面中 class="iconfont xxx" 才能显示图标。[出处: JS-模块]
import '@/styles/icon/iconfont.css'

// 知识点：App 是根组件，整个项目最终都会渲染到 App.vue 内部。[出处: JS-模块, Vue2-SFC]
import App from '@/App.vue'
// 知识点：store 是 Vuex 根仓库，用于保存登录态、侧边栏状态等全局数据。[出处: JS-模块, Vuex-Store]
import store from '@/store'
// 知识点：router 是路由实例，用于维护“地址和页面组件”的对应关系。[出处: JS-模块, VueRouter-配置]
import router from '@/router'
// 知识点：导入图标组件注册文件；这种只 import 不接收变量的写法，是为了执行该模块的副作用。[出处: JS-模块]
import '@/icons/components'
// 知识点：导入权限文件；permission.ts 会在执行时注册全局路由守卫。[出处: JS-模块, VueRouter-守卫]
import '@/permission'
// 知识点：导入环境检查工具函数，后面挂到 Vue 原型供组件调用。[出处: JS-模块]
import { checkProcessEnv } from '@/utils/common'

// 知识点：Vue.use 用来安装 Vue 插件，插件必须在创建根实例前安装。[出处: Vue2-插件]
Vue.use(ElementUI)
// 知识点：安装地区联动插件，让它的组件或能力可在 Vue 应用中使用。[出处: Vue2-插件]
Vue.use(VueAreaLinkage)
// 知识点：安装 svg 图标插件，并通过第二个参数传入插件配置。[出处: Vue2-插件]
Vue.use(SvgIcon, {
  // 知识点：tagName 配置模板里使用的组件标签名，这里是 <svg-icon />。[出处: Vue2-插件, Vue2-模板]
  'tagName': 'svg-icon',
  // 知识点：defaultWidth 配置 svg 图标默认宽度。[出处: Vue2-插件]
  'defaultWidth': '1em',
  // 知识点：defaultHeight 配置 svg 图标默认高度。[出处: Vue2-插件]
  'defaultHeight': '1em'
})

// 知识点：productionTip=false 会关闭 Vue 在生产环境的启动提示，减少控制台噪音。[出处: Vue2-实例]
Vue.config.productionTip = false
// 知识点：挂到 Vue.prototype 上的属性，可以在组件里通过 this.moment 访问。[出处: Vue2-实例]
Vue.prototype.moment = moment
// 知识点：把工具函数挂到 Vue 原型后，组件里可以通过 this.$checkProcessEnv 调用。[出处: Vue2-实例]
Vue.prototype.$checkProcessEnv = checkProcessEnv

// 知识点：保存原始 push 方法，后面重写时需要调用它，避免丢失原有跳转能力。[出处: JS-对象, VueRouter-配置]
const routerPush = Router.prototype.push
// 知识点：重写 Router.prototype.push，用于统一处理重复点击同一路由时的 Promise 报错。[出处: JS-Promise, VueRouter-配置]
Router.prototype.push = function push(location) {
  // 知识点：call(this, location) 保证原始 push 执行时 this 仍指向当前 router 实例。[出处: JS-对象]
  return routerPush.call(this, location).catch(error => error)
}
// 知识点：把 ECharts 挂到 Vue 原型，组件里可以通过 this.$echarts 创建图表。[出处: Vue2-实例]
Vue.prototype.$echarts = echarts

// 知识点：new Vue 创建根 Vue 实例，这是整个应用的起点。[出处: Vue2-实例]
new Vue({
  // 知识点：注入 router 后，组件才能使用 this.$router、this.$route，router-view 才能工作。[出处: VueRouter-配置, VueRouter-出口]
  router,
  // 知识点：注入 store 后，组件才能使用 this.$store 或通过模块读取全局状态。[出处: Vuex-Store]
  store,
  // 知识点：render 函数把 App 组件转换成虚拟 DOM，Vue 再渲染成真实页面。[出处: Vue2-实例]
  'render': (h) => h(App)
// 知识点：$mount('#app') 表示把 Vue 应用挂载到 public/index.html 的 id="app" 元素上。[出处: Vue2-实例]
}).$mount('#app')
