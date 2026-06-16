<template>
  <div class="tab-change">
    <div v-for="item in changedOrderList"
         :key="item.value"
         class="tab-item"
         :class="{ active: item.value === activeIndex }"
         @click="tabChange(item.value)"
    >
      <el-badge :class="{'special-item':item.num<10}"
                class="item"
                :value="item.num > 99 ? '99+' : item.num"
                :hidden="!([2, 3, 4].includes(item.value) && item.num)"
      >
        {{ item.label }}
      </el-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { getOrderDetailPage } from '@/api/order'

@Component({
  name: 'TabChange'
})
export default class extends Vue {
  // 父组件传入的各状态订单数量。
  @Prop({ default: '' }) orderStatics: any
  // 父组件传入的默认激活 tab。
  @Prop({ default: '' }) defaultActivity: any
  private activeIndex: number = this.defaultActivity || 0

  @Watch('defaultActivity')
  // 路由或父组件状态变化时，同步当前激活 tab。
  private onChange(val) {
    this.activeIndex = Number(val)
  }

  get changedOrderList() {
    // 把订单状态和数量合并成 tab 展示数据。
    return [
      {
        label: '全部订单',
        value: 0
      },
      {
        label: '待接单',
        value: 2,
        num: this.orderStatics.toBeConfirmed
      },
      {
        label: '待派送',
        value: 3,
        num: this.orderStatics.confirmed
      },
      {
        label: '派送中',
        value: 4,
        num: this.orderStatics.deliveryInProgress
      },
      {
        label: '已完成',
        value: 5
      },
      {
        label: '已取消',
        value: 6
      }
    ]
  }

  private tabChange(activeIndex) {
    // 点击 tab 后通知父组件重新查询对应状态的订单。
    this.activeIndex = activeIndex
    this.$emit('tabChange', activeIndex)
  }
}
</script>
<style lang="scss">
.tab-change {
  display: flex;
  border-radius: 4px;
  margin-bottom: 20px;

  .tab-item {
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #333;
    border: 1px solid #e5e4e4;
    background-color: white;
    border-left: none;
    cursor: pointer;
    .special-item {
      .el-badge__content {
        width: 20px;
        padding: 0 5px;
      }
    }
    .item {
      .el-badge__content {
        background-color: #fd3333 !important;
        line-height: 18px;
        height: auto;
        min-width: 18px;
        min-height: 18px;
        // border-radius: 50%;
      }
      .el-badge__content.is-fixed {
        top: 14px;
        right: 2px;
      }
    }
  }
  .active {
    background-color: #ffc200;
    font-weight: bold;
  }
  .tab-item:first-child {
    border-left: 1px solid #e5e4e4;
  }
}
</style>
