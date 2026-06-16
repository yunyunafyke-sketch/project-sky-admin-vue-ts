<template>
  <!-- 顶部栏的侧边栏收起/展开按钮。is-active 会让图标旋转。 -->
  <div :class="[{'is-active': isActive}]" @click="toggleClick">
    <svg-icon name="hamburger" width="20" height="20" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  'name': 'Hamburger'
})

export default class extends Vue {
  // 由父组件传入当前侧边栏是否展开。
  @Prop({ 'default': false }) private isActive!: boolean

  private toggleClick() {
    // 子组件不直接改 Vuex，而是通知父组件“我被点击了”。
    this.$emit('toggleClick');
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
}

.is-active {
  transform: rotate(180deg);
}
</style>
