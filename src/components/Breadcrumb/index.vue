<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import pathToRegexp from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'

@Component({
  'name': 'Breadcrumb'
})

export default class extends Vue {
  // breadcrumbs 保存当前路由匹配到的面包屑节点。
  private breadcrumbs: RouteRecord[] = []

  @Watch('$route')
  private onRouteChange(route: Route) {
    // 进入 redirect 这类中间页面时，不更新面包屑。
    if (route.path.startsWith('/redirect/')) {
      return
    }

    this.getBreadcrumb()
  }

  created () {
    this.getBreadcrumb()
  }

  private getBreadcrumb () {
    // this.$route.matched 是当前地址命中的所有父子路由记录。
    let matched = this.$route.matched.filter(
      item => item.meta && item.meta.title
    )
    const first = matched[0]
    // if (!this.isDashboard(first)) {
    //   matched = [
    //     { path: '/', meta: { title: '集团管理' } } as RouteRecord
    //   ].concat(matched)
    // }
    this.breadcrumbs = matched.filter(item => {
      return item.meta && item.meta.title && item.meta.breadcrumb !== false
    })
  }

  private isDashboard (route: RouteRecord) {
    const name = route && route.meta && route.meta.title
    return name === '集团管理'
  }

  private pathCompile (path: string) {
    // 动态路由里可能有 /xxx/:id，这里把 params 编译进真实路径。
    const { params } = this.$route
    const toPath = pathToRegexp.compile(path)
    return toPath(params)
  }

  private handleLink (item: any) {
    // 点击非最后一级面包屑时，如果有 redirect 就跳 redirect，否则跳自己的 path。
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect)
      return
    }
    this.$router.push(this.pathCompile(path))
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
