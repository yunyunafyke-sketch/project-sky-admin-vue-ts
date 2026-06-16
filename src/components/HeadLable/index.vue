<template>
  <div class="HeadLable">
    <!-- goback 为 true 时显示返回按钮。 -->
    <span
      v-if="goback"
      class="goBack"
      @click="goBack()"
    ><img
      src="@/assets/icons/btn_back@2x.png"
      alt=""
    > 返回</span>
    <!-- 默认显示标题；butList 为 true 时改由插槽展示按钮区域。 -->
    <span v-if="!butList">{{ title }}</span>
    <div v-if="butList">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  'name': 'Hamburger'
})
export default class extends Vue {
  // 是否显示返回按钮。
  @Prop({ 'default': false }) private goback!: boolean
  // 是否使用 slot 自定义右侧按钮区域。
  @Prop({ 'default': false }) private butList!: boolean
  // 页面标题。
  @Prop({ 'default': '集团管理' }) private title!: string

  private toggleClick() {
    this.$emit('toggleClick')
  }

  private goBack() {
    // 回到浏览器历史记录里的上一个页面。
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
  .HeadLable{
    // position: absolute;
    background: #fff;
    color: #333333;
    height: 64px;
    font-size: 16px;
    // width: 300px;
    padding-left: 22px;
    line-height: 64px;
    font-weight: 700;
    margin-bottom: 15px;
    top:0px;
    left: 0px;
    opacity: 0;
    animation: opacity 500ms ease-out 800ms forwards;
    .goBack{
      border-right: solid 1px #d8dde3;
      padding-right: 14px;
      margin-right: 14px;
      font-size: 16px;
      color: #333333;
      cursor: pointer;
      font-weight: 400;
      img{
        position: relative;
        top:24px;
        margin-right: 5px;
        width: 18px;
        height: 18px;
        float: left;
      }
    }
  }
  @keyframes opacity {
     0% {
       opacity: 0;
       left: 80px;
     }
     100% {
       opacity: 1;
       left: 0;
     }
   }
</style>
