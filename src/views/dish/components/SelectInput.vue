<template>
  <div class="selectInput">
    <el-input
      v-model="value"
      type="text"
      style="width: 100%"
      placeholder="请选择口味"
      clearable
      readonly
      @focus="selectFlavor(true)"
      @blur="outSelect(false)"
    />
    <div v-if="mak && dishFlavorsData.length" class="flavorSelect">
      <span
        v-for="(it, ind) in dishFlavorsData"
        :key="ind"
        class="items"
        @click="checkOption(it, ind)"
      >{{ it.name }}</span>
      <span v-if="dishFlavorsData == []" class="none">无数据</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'selectInput',
})
export default class extends Vue {
  // 当前已经选择的口味数据。
  @Prop({ default: [] }) private selectFlavorsData!: []
  // 全部可选口味数据。
  @Prop({ default: [] }) private dishFlavorsData!: []
  // 当前选中的值。
  @Prop({ default: '' }) private value!: number
  // 当前组件在父级口味列表中的下标。
  @Prop({ default: 0 }) private index!: number
  private keyValue = NaN

  private mak: boolean = false

  private selectFlavor(st: boolean) {
    // 打开/关闭口味下拉选择面板。
    this.mak = st
  }

  private outSelect(st: boolean) {
    // 延迟关闭，给点击下拉项留出时间。
    const _this = this
    setTimeout(function () {
      _this.mak = st
    }, 200)
  }

  private inputHandle(val: any) {
    // 当前模板中未直接使用，保留给输入选择场景。
    this.selectFlavor(false)
  }

  checkOption(val: any, ind: any) {
    // 选择口味后通知父组件，父组件负责更新 dishFlavors。
    this.$emit('select', val.name, this.index, ind)
    this.keyValue = val.name
  }
}
</script>

<style lang="scss" scoped>
.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;
  .flavorSelect {
    position: absolute;
    width: 100%;
    // padding: 0 10px;
    border-radius: 3px;
    border: solid 1px #e4e7ed;
    line-height: 30px;
    text-align: center;
    background: #fff;
    top: 50px;
    z-index: 99;
    .items {
      cursor: pointer;
      display: inline-block;
      width: 100%;
      line-height: 35px;
      border-bottom: solid 1px #f4f4f4;
      color: #666;
      margin: 0 !important;
      &:hover {
        background-color: #fffbf0;
      }
      &:active {
        background-color: #fffbf0;
        color: #ffc200;
      }
    }
    .none {
      font-size: 14px;
    }
  }
}
</style>
