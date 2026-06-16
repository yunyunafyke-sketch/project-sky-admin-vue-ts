import { ECharts } from 'echarts';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    'name': 'ResizeMixin'
})
export default class extends Vue {
  // 具体图表组件会把 echarts.init(...) 的结果赋给 chart。
  protected chart!: ECharts | null
  // 左侧菜单元素，用来监听菜单宽度变化。
  private sidebarElm?: Element

  mounted() {
      this.initResizeEvent();
      this.initSidebarResizeEvent();
  }

  beforeDestroy() {
      this.destroyResizeEvent();
      this.destroySidebarResizeEvent();
  }

  activated() {
      this.initResizeEvent();
      this.initSidebarResizeEvent();
  }

  deactivated() {
      this.destroyResizeEvent();
      this.destroySidebarResizeEvent();
  }

  private chartResizeHandler() {
      // 容器尺寸变化后通知 ECharts 重算宽高，否则图表可能被压缩或留白。
      if (this.chart) {
          this.chart.resize();
      }
  }

  private sidebarResizeHandler(e: TransitionEvent) {
      // 只关心侧边栏 width 动画结束，结束后再 resize 图表。
      if (e.propertyName === 'width') {
          this.chartResizeHandler();
      }
  }

  private initResizeEvent() {
      // 浏览器窗口尺寸变化时重绘图表。
      if (this.chartResizeHandler) {
          window.addEventListener('resize', this.chartResizeHandler);
      }
  }

  private destroyResizeEvent() {
      if (this.chartResizeHandler) {
          window.removeEventListener('resize', this.chartResizeHandler);
      }
  }

  private initSidebarResizeEvent() {
      // 侧边栏收起/展开会改变内容区宽度，也需要重绘图表。
      this.sidebarElm = document.getElementsByClassName('sidebar-container')[0];
      if (this.sidebarElm) {
          this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler as EventListener);
      }
  }

  private destroySidebarResizeEvent() {
      if (this.sidebarElm) {
          this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler as EventListener);
      }
  }
}
