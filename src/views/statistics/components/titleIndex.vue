<template>
  <div class="title-index">
    <div class="month">
      <ul class="tabs">
        <li
          v-for="(item, index) in tabsParam"
          :key="index"
          class="li-tab"
          :class="{ active: index === nowIndex }"
          @click="toggleTabs(index)"
        >
          {{ item }}
          <span />
        </li>
      </ul>
    </div>
    <div class="get-time">
      <p>
        已选时间：{{ tateData[0] }} 至
        {{ tateData[tateData.length - 1] }}
      </p>
    </div>
    <el-button
      icon="iconfont icon-download"
      class="right-el-button"
      @click="handleExport"
    >
      数据导出
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { exportInfor } from '@/api/index'
@Component({
  name: 'TitleIndex',
})
export default class extends Vue {
  // 当前选中的时间范围编号。
  @Prop() private flag!: any
  // 当前时间范围的起止日期。
  @Prop() private tateData!: any
  // 营业额数据，当前组件保留该 prop 以便扩展。
  @Prop() private turnoverData!: any

  nowIndex = 2 - 1
  value = []
  // 时间范围 tab 文案。
  tabsParam = ['昨日', '近7日', '近30日', '本周', '本月']
  @Watch('flag')
  // 父组件切换 flag 后，同步当前高亮 tab。
  getNowIndex(val) {
    this.nowIndex = val
  }
  // tab切换
  toggleTabs(index: number) {
    // 通知父组件根据新的时间范围重新请求统计数据。
    this.nowIndex = index
    this.value = []
    this.$emit('sendTitleInd', index + 1)
  }
  //  数据导出
  /** 导出按钮操作 */
  handleExport() {
    // 后端返回 Excel 文件流，前端用 Blob URL 触发浏览器下载。
    this.$confirm('是否确认导出最近30天运营数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async function () {
        const { data } = await exportInfor()
        let url = window.URL.createObjectURL(data)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = '运营数据统计报表.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .then((response) => {})
  }
}
</script>
