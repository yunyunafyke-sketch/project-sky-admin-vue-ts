// 知识点：导入 Vue 构造函数，用于安装 Vuex 插件。[出处: JS-模块, Vue2-插件]
import Vue from 'vue'
// 知识点：导入 Vuex，Vuex 用于管理全局状态。[出处: JS-模块, Vuex-Store]
import Vuex from 'vuex'
// 知识点：IAppState 是 app 模块状态的 TypeScript 类型。[出处: JS-模块, TS-接口, Vuex-Store]
import { IAppState } from './modules/app'
// 知识点：IUserState 是 user 模块状态的 TypeScript 类型。[出处: JS-模块, TS-接口, Vuex-Store]
import { IUserState } from './modules/user'

// 知识点：Vue.use(Vuex) 安装 Vuex 插件，组件中才可以使用 this.$store。[出处: Vue2-插件, Vuex-Store]
Vue.use(Vuex)

// 知识点：interface 用来描述对象结构，这里描述根 store 里有哪些模块。[出处: TS-接口]
export interface IRootState {
  // 知识点：app 字段对应 app 模块状态，例如侧边栏、设备类型。[出处: TS-接口, Vuex-Store]
  app: IAppState
  // 知识点：user 字段对应 user 模块状态，例如 token、用户名、角色。[出处: TS-接口, Vuex-Store]
  user: IUserState
}

// 知识点：export default 导出 Vuex 根仓库，main.ts 会把它注入 Vue 根实例。[出处: JS-模块, Vuex-Store]
export default new Vuex.Store<IRootState>({})
