<template>
  <div class="input-auto-complete">
    <el-input
      v-model="input"
      :placeholder="placeholder"
      style="width: 250px"
      clearable
      @clear="init"
      @keyup.enter.native="init"
    >
      <i
        slot="prefix"
        class="el-input__icon el-icon-search"
        style="cursor: pointer"
        @click="init"
      />
    </el-input>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'InputAutoComplete',
})
export default class extends Vue {
  // input 保存输入框当前内容，v-model 会让它和输入框双向绑定。
  private input: any = ''
  // data 当前没有在组件内部使用，保留给后续扩展自动补全数据源。
  @Prop({ default: [] }) data: Array<any>
  // 输入框占位提示。
  @Prop({ default: '' }) placeholder: string
  // ObKey 当前没有在组件内部使用，通常表示候选项里用于展示的字段名。
  @Prop({ default: 'name' }) ObKey: string

  init() {
    // 通知父组件执行搜索/刷新，参数是当前输入内容。
    this.$emit('init', this.input)
  }
}
</script>
<style scoped>
.input-auto-complete {
  display: inline-block;
}
</style>
