<!-- 知识点：template 是 Vue 单文件组件的模板区域，负责描述页面结构。[出处: Vue2-SFC, Vue2-模板] -->
<template>
  <!-- 知识点：id="app" 是根组件外层容器，也方便全局样式或调试定位根节点。[出处: Vue2-模板] -->
  <div id="app">
    <!-- 知识点：router-view 是路由出口，当前地址匹配到的页面组件会显示在这里。[出处: VueRouter-出口] -->
    <router-view />
  </div>
</template>

<!-- 知识点：script lang="ts" 表示这里写的是 TypeScript，而不是普通 JavaScript。[出处: Vue2-SFC, TS-基础类型] -->
<script lang="ts">
// 知识点：Component 是类组件装饰器，Vue 是组件基类。[出处: JS-模块, TS-类]
import { Component, Vue } from 'vue-property-decorator'

// 知识点：@Component 把下面的 TypeScript class 标记为 Vue 组件。[出处: TS-类, Vue2-SFC]
@Component({
  // 知识点：name 是组件名，常用于 Vue Devtools 调试和递归组件识别。[出处: Vue2-SFC]
  name: 'App',
})
// 知识点：export default 导出当前组件，main.ts 才能 import App from '@/App.vue'。[出处: JS-模块]
// 知识点：extends Vue 表示这个类继承 Vue 组件能力，比如生命周期、this.$router 等。[出处: TS-类, Vue2-实例]
export default class extends Vue {}
</script>
