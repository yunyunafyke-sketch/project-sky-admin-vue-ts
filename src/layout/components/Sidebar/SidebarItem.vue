<template>
  <div>
    <!-- <div
      v-if=" !item.meta || !item.meta.hidden "
      :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}]"
    > -->
    <div
      v-if="!item.meta || !item.meta.hidden"
      :class="['menu-wrapper', 'full-mode', { 'first-level': isFirstLevel }]"
    >
      <!-- 没有可展示子菜单时，直接渲染成一个菜单项。 -->
      <template v-if="theOnlyOneChild && !theOnlyOneChild.children">
        <sidebar-item-link
          v-if="theOnlyOneChild.meta"
          :to="resolvePath(theOnlyOneChild.path)"
        >
          <el-menu-item
            :index="resolvePath(theOnlyOneChild.path)"
            :class="{ 'submenu-title-noDropdown': isFirstLevel }"
          >
            <!-- <i v-if="theOnlyOneChild.meta.title==='工作台'" class="iconfont icon img-icon-sel" /> -->
            <!-- <svg-icon v-if="theOnlyOneChild.meta.title==='工作台'" name="dashboard" width="20" height="20"></svg-icon> -->
            <i
              v-if="theOnlyOneChild.meta.icon"
              class="iconfont"
              :class="theOnlyOneChild.meta.icon"
            />
            <span v-if="theOnlyOneChild.meta.title" slot="title">{{
              theOnlyOneChild.meta.title
            }}</span>
          </el-menu-item>
        </sidebar-item-link>
      </template>
      <!-- 有可展示子菜单时，渲染成可展开的二级菜单。 -->
      <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
        <template slot="title">
          <i
            v-if="item.meta && item.meta.icon"
            class="iconfont"
            :class="item.meta.icon"
          />
          <span v-if="item.meta && item.meta.title" slot="title">{{
            item.meta.title
          }}</span>
        </template>
        <template v-if="item.children">
          <sidebar-item
            v-for="child in item.children"
            :key="child.path"
            :item="child"
            :is-collapse="isCollapse"
            :is-first-level="false"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </template>
      </el-submenu>
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { Route, RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'

@Component({
  name: 'SidebarItem',
  components: {
    SidebarItemLink,
  },
})
export default class extends Vue {
  // item 是当前要渲染的一条路由配置。
  @Prop({ required: true }) private item!: RouteConfig
  // 父级菜单是否处于收起状态。
  @Prop({ default: false }) private isCollapse!: boolean
  // 当前项是否是第一层菜单。
  @Prop({ default: true }) private isFirstLevel!: boolean
  // 当前菜单项的父路径，用于拼接完整路由。
  @Prop({ default: '' }) private basePath!: string

  // 统计当前路由下有多少个不隐藏的子路由。
  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false
        }
        return true
      })
      return showingChildren.length
    }
    return 0
  }

  get roles() {
    return UserModule.roles
  }

  // 如果没有可展示子菜单，就把自己当成唯一菜单项渲染。
  get theOnlyOneChild() {
    if (this.showingChildNumber > 0) {
      return null
    }
    if (this.item.children) {
      for (let child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child
        }
      }
    }
    // If there is no children, return itself with path removed,
    // because this.basePath already conatins item's path information
    return { ...this.item, path: '' }
  }

  // 把相对 path 拼成完整 path；外链地址不做拼接。
  private resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }
}
</script>
