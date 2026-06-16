<template>
  <section class="app-main">
    <!-- transition 给路由页面切换增加过渡动画。 -->
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <!-- Layout 的子路由页面最终显示在这里。 -->
      <router-view />
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  'name': 'AppMain'
})
// AppMain 自身没有业务逻辑，只负责提供后台内容区的 router-view。
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100% - 64px);
  overflow-y: auto;
}
</style>
