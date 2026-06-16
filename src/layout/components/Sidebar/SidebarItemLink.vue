<template>
  <!-- 外链用普通 a 标签，新窗口打开。 -->
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <!-- 项目内部路由用 router-link，避免整页刷新。 -->
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'

@Component({
  'name': 'SidebarItemLink'
})
export default class extends Vue {
  // to 是目标地址，可以是内部路由，也可以是 http/mailto/tel 外链。
  @Prop({ 'required': true }) private to!: string

  private isExternal = isExternal
}
</script>
