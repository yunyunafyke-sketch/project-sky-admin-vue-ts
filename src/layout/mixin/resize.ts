import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule, DeviceType } from '@/store/modules/app'

// 小于该宽度时按移动端布局处理。
const WIDTH = 992; // refer to Bootstrap's responsive design

@Component({
    'name': 'ResizeMixin'
})
export default class extends Vue {
    // 这些 getter 让混入类可以直接读 Vuex 的设备类型和侧边栏状态。
    get device () {
      return AppModule.device
    }

    get sidebar () {
      return AppModule.sidebar
    }

  @Watch('$route')
    // 移动端切换路由后自动收起侧边栏，避免菜单遮挡新页面。
    private onRouteChange() {
      if (this.device === DeviceType.Mobile && this.sidebar.opened) {
        AppModule.CloseSideBar(false)
      }
    }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  mounted() {
    // 首次进入时根据屏幕宽度决定是否切换到移动端布局。
    const isMobile = this.isMobile()
    if (isMobile) {
      AppModule.ToggleDevice(DeviceType.Mobile)
      AppModule.CloseSideBar(true)
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  private isMobile() {
    // document.body.getBoundingClientRect() 能拿到当前页面可视宽度。
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  private resizeHandler() {
    // 页面在后台标签页时不处理 resize，减少无意义计算。
    if (!document.hidden) {
      const isMobile = this.isMobile()
      AppModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile) {
        AppModule.CloseSideBar(true)
      }
    }
  }
}
