# 前端小白入门教程

这份教程基于 `FRONTEND_LEARNING_CHECKLIST.md` 整理，目标是帮你从“看不懂项目”过渡到“能顺着项目流程读代码”。

你不需要一开始就把 Vue、TypeScript、Vuex、Axios 全部学完。先按本教程把项目主流程跑通，再逐个补基础知识。

## 0. 先建立整体认知

这个项目是一个后台管理系统，可以先理解成：

```text
浏览器打开页面
  -> Vue 启动项目
  -> Router 根据地址决定显示哪个页面
  -> 页面调用接口拿数据
  -> Axios 负责请求后端
  -> Vue 把数据渲染到表格、表单、弹窗里
```

项目主要技术栈：

| 技术 | 作用 |
| --- | --- |
| Vue 2 | 页面框架，负责把数据变成界面 |
| TypeScript | 给 JavaScript 加类型提示 |
| Vue Router | 管理页面地址和页面组件的关系 |
| Vuex | 管理全局状态，比如 token、侧边栏状态 |
| Axios | 请求后端接口 |
| Element UI | 提供表格、表单、按钮、弹窗等后台组件 |

第一阶段目标：

- 能找到项目从哪里启动。
- 能找到一个菜单对应哪个页面文件。
- 能看懂页面怎么调用接口。
- 能知道登录拦截在哪里。
- 能知道 token 为什么会自动带到请求头里。

## 1. JavaScript 模块：先学会看 import/export

项目里每个文件开头都有很多 `import`，这是你读代码的第一关。

### 1.1 你需要懂什么

```ts
import Vue from 'vue'
```

意思是：从 `vue` 这个包里导入默认导出的内容，并命名为 `Vue`。

```ts
import { Component, Vue } from 'vue-property-decorator'
```

意思是：从包里导入指定名字的内容。

```ts
import '@/styles/index.scss'
```

意思是：不接收变量，只执行这个文件。常见于引入全局样式、注册图标、注册路由守卫。

```ts
export default router
```

意思是：把当前文件的主要内容导出去，别的文件可以 `import router from '@/router'`。

### 1.2 在项目里怎么看

重点看：

- `src/main.ts`
- `src/router.ts`
- `src/store/index.ts`

你可以先练习回答：

- `src/main.ts` 导入了哪些东西？
- 哪些是 npm 包？
- 哪些是项目自己的文件？
- 哪些 import 只是为了执行副作用？

## 2. Vue 2 基础：看懂一个 .vue 文件

Vue 项目里，一个页面或组件通常是 `.vue` 文件。

### 2.1 单文件组件结构

```vue
<template>
  <!-- 页面结构 -->
</template>

<script lang="ts">
// 页面逻辑
</script>

<style lang="scss" scoped>
/* 页面样式 */
</style>
```

读 `.vue` 文件建议按这个顺序：

1. 先看 `<template>`，知道页面长什么样。
2. 再看 `<script>`，知道数据从哪里来、按钮点击做什么。
3. 最后看 `<style>`，知道样式怎么写。

### 2.2 项目入口怎么启动

看 `src/main.ts`：

```ts
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
```

可以翻译成：

```text
创建 Vue 应用
  -> 注入路由 router
  -> 注入全局状态 store
  -> 渲染根组件 App
  -> 挂载到 public/index.html 的 #app 上
```

### 2.3 根组件做了什么

看 `src/App.vue`：

```vue
<router-view />
```

`router-view` 是一个页面出口。

当前浏览器地址匹配到哪个页面，哪个页面就会显示在这里。

## 3. Vue Router：地址怎么对应页面

后台系统有很多页面，例如：

- 工作台
- 数据统计
- 订单管理
- 套餐管理
- 菜品管理
- 分类管理
- 员工管理

这些页面和地址的关系写在 `src/router.ts`。

### 3.1 一条路由长什么样

```ts
{
  path: "category",
  component: () => import("@/views/category/index.vue"),
  meta: {
    title: "分类管理",
    icon: "icon-category"
  }
}
```

可以这样读：

| 字段 | 含义 |
| --- | --- |
| `path` | 浏览器地址的一部分 |
| `component` | 这个地址对应哪个页面文件 |
| `meta.title` | 菜单文字或页面标题 |
| `meta.icon` | 菜单图标 |

所以你访问分类管理时，可以顺着路由找到：

```text
/category
  -> src/views/category/index.vue
```

### 3.2 children 是什么

项目里 `/` 路由使用了 `Layout`：

```ts
{
  path: "/",
  component: Layout,
  children: [...]
}
```

意思是：

```text
先显示后台主框架 Layout
  -> 左边是菜单
  -> 上面是导航栏
  -> 中间通过 router-view 显示 children 里的页面
```

### 3.3 hidden 是什么

有些页面不出现在菜单里，例如：

```ts
{
  path: "/dish/add",
  meta: {
    title: "添加菜品",
    hidden: true
  }
}
```

这种页面通常不是从左侧菜单直接点进去，而是从列表页点“新增”按钮进去。

## 4. 路由守卫：登录拦截在哪里

登录拦截在 `src/permission.ts`。

核心逻辑是：

```text
每次切换页面前
  -> 看 Cookie 里有没有 token
  -> 有 token 就放行
  -> 没 token 且页面需要登录，就跳到 /login
  -> 没 token 但页面不需要登录，也放行
```

你重点看：

```ts
router.beforeEach((to, from, next) => {
  ...
})
```

几个关键词：

| 关键词 | 含义 |
| --- | --- |
| `to` | 你要去的目标页面 |
| `from` | 你从哪个页面来 |
| `next()` | 放行 |
| `next('/login')` | 跳到登录页 |
| `to.meta.notNeedAuth` | 当前页面是否不需要登录 |

读懂这里后，你就能知道：

- 为什么没登录会跳登录页。
- 为什么登录页自己不需要 token。
- 为什么路由的 `meta` 会影响权限判断。

## 5. TypeScript：先补够读项目的基础

这个项目不是普通 JavaScript，而是 TypeScript。

你先不用学很深，先掌握能看懂项目的几类语法。

### 5.1 类型标注

```ts
token: string
opened: boolean
userInfo: any
```

意思是：

| 写法 | 含义 |
| --- | --- |
| `string` | 字符串 |
| `boolean` | true/false |
| `any` | 任意类型，暂时不限制 |

### 5.2 interface

```ts
export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
}
```

`interface` 用来描述对象应该长什么样。

可以理解成：

```text
IAppState 这个状态对象里
  -> 必须有 device
  -> 必须有 sidebar
  -> sidebar 里必须有 opened 和 withoutAnimation
```

### 5.3 class

项目里很多 Vue 组件和 Vuex 模块使用 class 写法：

```ts
class App extends VuexModule implements IAppState {
  public statusNumber = 0
}
```

先这样理解：

| 写法 | 含义 |
| --- | --- |
| `class App` | 定义一个类 |
| `extends VuexModule` | 继承 Vuex 模块能力 |
| `implements IAppState` | 这个类要符合 IAppState 的结构 |
| `public` | 外部可以访问 |
| `private` | 类内部使用 |

## 6. Vuex：全局状态放在哪里

Vuex 用来保存多个页面都要用的数据。

例如：

- 登录 token
- 用户名
- 用户信息
- 侧边栏是否展开
- 当前设备是桌面端还是移动端

### 6.1 根 store

看 `src/store/index.ts`：

```ts
export default new Vuex.Store<IRootState>({})
```

它创建了全局 store。

`main.ts` 里把它注入 Vue：

```ts
new Vue({
  store
})
```

这样组件里才可以访问全局状态。

### 6.2 app 模块

看 `src/store/modules/app.ts`。

它主要管界面状态：

```text
sidebar.opened        侧边栏是否展开
sidebar.withoutAnimation  是否禁用动画
device                当前设备类型
statusNumber          顶部状态数字
```

### 6.3 Mutation 和 Action

Vuex 里有两个常见概念：

| 名称 | 作用 |
| --- | --- |
| Mutation | 真正修改 state |
| Action | 给组件调用，可以再调用 Mutation |

例子：

```ts
@Action
public ToggleSideBar(withoutAnimation: boolean) {
  this.TOGGLE_SIDEBAR(withoutAnimation)
}
```

可以理解成：

```text
组件调用 ToggleSideBar
  -> Action 接住这个调用
  -> Action 调用 TOGGLE_SIDEBAR
  -> Mutation 修改 sidebar.opened
```

## 7. Axios：接口请求怎么统一处理

后端接口请求统一封装在 `src/utils/request.ts`。

业务接口文件，例如 `src/api/category.ts`，不会直接使用 axios，而是使用封装后的 `request`。

### 7.1 创建 axios 实例

```ts
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 600000
})
```

可以理解成：

| 字段 | 含义 |
| --- | --- |
| `baseURL` | 所有接口的公共前缀 |
| `timeout` | 请求超时时间 |

### 7.2 请求拦截器

```ts
service.interceptors.request.use((config) => {
  ...
})
```

请求拦截器会在请求发出去前执行。

本项目里主要做两件事：

1. 如果有 token，把 token 放到请求头。
2. 判断是否重复请求，重复就取消。

重点看：

```ts
config.headers['token'] = UserModule.token
```

这就是“接口为什么会自动带 token”的原因。

### 7.3 响应拦截器

```ts
service.interceptors.response.use((response) => {
  ...
})
```

响应拦截器会在后端返回数据后执行。

本项目里主要做：

- 登录失效时跳回登录页。
- 请求完成后删除 pending 状态。
- 把响应继续返回给页面。

## 8. Element UI：后台页面常用组件

后台管理系统通常由这些组件组成：

| 组件 | 作用 |
| --- | --- |
| `el-button` | 按钮 |
| `el-table` | 表格 |
| `el-form` | 表单 |
| `el-input` | 输入框 |
| `el-select` | 下拉选择 |
| `el-dialog` | 弹窗 |
| `el-pagination` | 分页 |
| `Message` | 消息提示 |

建议从 `src/views/category/index.vue` 开始看。

因为分类管理页面通常包含后台系统最典型的结构：

```text
查询条件
  -> 查询按钮
  -> 表格
  -> 分页
  -> 新增/编辑弹窗
  -> 表单校验
  -> 接口请求
```

## 9. 用分类管理页面串起完整流程

假设你要看“分类管理”怎么工作的。

### 9.1 第一步：从路由找页面

打开 `src/router.ts`，找到：

```ts
path: "category"
component: () => import("@/views/category/index.vue")
```

说明分类管理页面在：

```text
src/views/category/index.vue
```

### 9.2 第二步：看页面结构

打开 `src/views/category/index.vue`。

先看 `<template>`：

```text
有没有搜索框？
有没有表格？
有没有分页？
有没有弹窗？
```

再看 `<script>`：

```text
页面数据定义在哪里？
页面初始化调用哪个方法？
按钮点击调用哪个方法？
接口方法从哪里 import？
```

### 9.3 第三步：找接口

分类页面会使用 `src/api/category.ts` 里的接口。

例如：

```ts
getCategoryPage({
  page: this.page,
  pageSize: this.pageSize
})
```

然后你跳到 `src/api/category.ts`，看它实际请求哪个后端地址：

```ts
request({
  url: '/category/page',
  method: 'get',
  params
})
```

### 9.4 第四步：看请求封装

最后回到 `src/utils/request.ts`，看请求发出去前做了什么：

```text
加 token
拼 GET 参数
防重复请求
处理 401
返回 response
```

这样你就能把一个后台页面从“菜单入口”读到“后端接口”。

## 10. 每天怎么学

建议按 7 天节奏学习。

### 第 1 天：只看启动流程

目标：

- 看懂 `src/main.ts`
- 看懂 `src/App.vue`

要能回答：

- 项目从哪个文件启动？
- `App.vue` 里为什么只有一个 `router-view`？
- `new Vue({...}).$mount('#app')` 是什么意思？

### 第 2 天：只看路由

目标：

- 看懂 `src/router.ts`
- 能从菜单名找到页面文件

要能回答：

- `path` 是什么？
- `component` 是什么？
- `children` 是什么？
- `hidden: true` 是什么？

### 第 3 天：只看登录拦截

目标：

- 看懂 `src/permission.ts`

要能回答：

- 为什么没登录会跳 `/login`？
- `next()` 是什么？
- `to.meta.notNeedAuth` 是什么？

### 第 4 天：只看 TypeScript 和 Vuex

目标：

- 看懂 `src/store/index.ts`
- 看懂 `src/store/modules/app.ts`

要能回答：

- `interface` 是什么？
- `enum` 是什么？
- `Mutation` 和 `Action` 区别是什么？

### 第 5 天：只看请求封装

目标：

- 看懂 `src/utils/request.ts`
- 看懂 `src/api/category.ts`

要能回答：

- `axios.create` 是什么？
- 请求拦截器做了什么？
- 响应拦截器做了什么？
- token 是在哪里加到请求头里的？

### 第 6 天：只看一个业务页面

目标：

- 看懂 `src/views/category/index.vue`

要能回答：

- 页面打开时调用哪个初始化方法？
- 表格数据保存在哪个变量里？
- 查询按钮调用哪个方法？
- 分页变化调用哪个方法？
- 新增/编辑弹窗由哪个变量控制显示？

### 第 7 天：自己画一条流程图

目标：

把分类管理页面流程画出来：

```text
点击分类管理菜单
  -> router.ts 匹配 /category
  -> 显示 src/views/category/index.vue
  -> 页面 created/mounted 调用初始化方法
  -> 初始化方法调用 getCategoryPage
  -> getCategoryPage 调用 request
  -> request 加 token 并发送请求
  -> 后端返回数据
  -> 页面把数据赋值给 tableData
  -> el-table 渲染表格
```

## 11. 你现在最应该避免什么

刚开始不要急着做这些事：

- 不要试图一次性看完所有页面。
- 不要先背 Vue 全部 API。
- 不要一上来改复杂业务逻辑。
- 不要看到 TypeScript 报类型就慌。
- 不要同时学 Vue 2、Vue 3、React。

更好的方式是：

```text
先读一条完整链路
  -> 再补这条链路上的基础知识
  -> 再换一个业务页面重复练习
```

## 12. 第一阶段完成标准

当你能独立回答这些问题，就说明第一阶段入门完成：

- 项目从哪个文件启动？
- `router-view` 是什么？
- 左侧菜单为什么能跳到对应页面？
- 登录拦截在哪里？
- token 从哪里来，又在哪里被带到请求头？
- Vuex 里保存了哪些全局状态？
- 一个列表页面一般有哪些组成部分？
- 一个接口请求从页面到后端大概经过哪些文件？

完成第一阶段后，再去系统学习官方文档会轻松很多。
