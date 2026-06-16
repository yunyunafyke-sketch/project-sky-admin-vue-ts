<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端展开侧边栏时显示遮罩，点击遮罩关闭侧边栏。 -->
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 左侧菜单。 -->
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- 顶部栏。 -->
      <navbar />
      <!-- 中间内容区，真正的页面会显示在 AppMain 里的 router-view 中。 -->
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { AppMain, Navbar, Sidebar } from './components'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'Layout',
  // 注册后，template 中才能使用 <app-main>、<navbar>、<sidebar>。
  components: {
    AppMain,
    Navbar,
    Sidebar,
  },
})
export default class extends mixins(ResizeMixin) {
  // classObj 会变成 app-wrapper 上的动态 class，控制侧边栏展开/收起和移动端布局。
  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile,
    }
  }

  // 点击移动端遮罩时关闭侧边栏。
  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 1366px;
  overflow-x: auto;
  overflow-y: hidden;
}

.main-container {
  height: 100%;
  background: #f3f4f7;
  position: relative;
  width: calc(100% - 190px);
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  background: $gray-5;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  // font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.hideSidebar {
  .main-container {
    margin-left: 80px;
    width: calc(100% - 80px);
  }

  .sidebar-container {
    width: 80px !important;
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
