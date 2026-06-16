// 知识点：这些装饰器来自 vuex-module-decorators，用 class 写法组织 Vuex 模块。[出处: JS-模块, TS-类, Vuex-Store]
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
// 知识点：导入 Cookie 工具，用于持久化侧边栏打开/关闭状态。[出处: JS-模块]
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
// 知识点：导入根 store，动态模块需要注册到这个根 store 上。[出处: JS-模块, Vuex-Store]
import store from '@/store'

// 知识点：enum 是 TypeScript 枚举，用名字表示固定选项，比直接写数字更易读。[出处: TS-基础类型]
export enum DeviceType {
  // 知识点：Mobile 的默认枚举值是 0，表示移动端设备。[出处: TS-基础类型]
  Mobile,
  // 知识点：Desktop 的默认枚举值是 1，表示桌面端设备。[出处: TS-基础类型]
  Desktop
}

// 知识点：interface 描述 app 模块 state 的结构。[出处: TS-接口, Vuex-Store]
export interface IAppState {
  // 知识点：device 保存当前设备类型，页面可根据它切换布局。[出处: TS-接口, Vuex-Store]
  device: DeviceType
  // 知识点：sidebar 保存左侧菜单相关状态。[出处: TS-接口, Vuex-Store]
  sidebar: {
    // 知识点：opened 表示侧边栏是否展开。[出处: TS-接口]
    opened: boolean
    // 知识点：withoutAnimation 表示切换侧边栏时是否禁用动画。[出处: TS-接口]
    withoutAnimation: boolean

  }
  // 知识点：statusNumber 保存顶部状态数字，例如未读消息数；这里类型写的是 Number 对象类型。[出处: TS-基础类型]
  statusNumber:Number
}

// 知识点：@Module 把 class 声明成 Vuex 模块；dynamic=true 表示运行时动态注册。[出处: TS-类, Vuex-Store]
@Module({ 'dynamic': true, store, 'name': 'app' })
// 知识点：App 继承 VuexModule，并实现 IAppState，表示它必须包含接口中定义的状态字段。[出处: TS-类, TS-接口, Vuex-Store]
class App extends VuexModule implements IAppState {
  // 知识点：public 字段就是 Vuex state，组件可以读取这些全局 UI 状态。[出处: TS-类, Vuex-Store]
  public sidebar = {
    // 知识点：opened 初始为 true，表示默认展开侧边栏。[出处: Vuex-Store]
    'opened': true, //getSidebarStatus() !== 'closed',
    // 知识点：withoutAnimation 初始为 false，表示默认允许侧边栏动画。[出处: Vuex-Store]
    'withoutAnimation': false
  }
  // 知识点：device 初始为 Desktop，表示默认按桌面端布局展示。[出处: Vuex-Store]
  public device = DeviceType.Desktop
  // 知识点：statusNumber 初始为 0，表示默认没有顶部状态数字。[出处: Vuex-Store]
  public statusNumber = 0

  // 知识点：@Mutation 标记同步修改 state 的方法，Vuex 推荐所有状态变化都通过 mutation 完成。[出处: Vuex-Mutation]
  @Mutation
  // 知识点：TOGGLE_SIDEBAR 切换侧边栏展开状态，参数控制是否禁用动画。[出处: Vuex-Mutation]
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    // 知识点：取反 !this.sidebar.opened，可以在 true/false 之间切换。[出处: JS-对象]
    this.sidebar.opened = !this.sidebar.opened
    // 知识点：把参数保存到 state，组件可据此决定是否播放动画。[出处: Vuex-Mutation]
    this.sidebar.withoutAnimation = withoutAnimation
    // 知识点：if 判断当前侧边栏是否展开。[出处: JS-对象]
    if (this.sidebar.opened) {
      // 知识点：展开时把状态写入 Cookie，下次刷新还能恢复。[出处: Vuex-Mutation]
      setSidebarStatus('opened')
    } else {
      // 知识点：关闭时把 closed 写入 Cookie。[出处: Vuex-Mutation]
      setSidebarStatus('closed')
    }
  }

  // 知识点：@Mutation 标记关闭侧边栏的同步状态修改方法。[出处: Vuex-Mutation]
  @Mutation
  // 知识点：CLOSE_SIDEBAR 只负责关闭，不做展开/关闭切换。[出处: Vuex-Mutation]
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    // 知识点：把 opened 设为 false，表示侧边栏关闭。[出处: Vuex-Mutation]
    this.sidebar.opened = false
    // 知识点：保存是否禁用动画的状态。[出处: Vuex-Mutation]
    this.sidebar.withoutAnimation = withoutAnimation
    // 知识点：同步写入 Cookie，刷新页面后仍能记住关闭状态。[出处: Vuex-Mutation]
    setSidebarStatus('closed')
  }

  // 知识点：@Mutation 标记修改顶部状态数字的方法。[出处: Vuex-Mutation]
  @Mutation
  // 知识点：这里参数名写成 device，但实际赋值给 statusNumber，学习时注意命名和含义可能不一致。[出处: Vuex-Mutation]
  private STATUS_NUMBER(device: DeviceType) {
    // 知识点：修改 Vuex state 中的 statusNumber。[出处: Vuex-Mutation]
    this.statusNumber = device
  }

  // 知识点：@Mutation 标记修改设备类型的方法。[出处: Vuex-Mutation]
  @Mutation
  // 知识点：TOGGLE_DEVICE 接收设备类型并保存到 state。[出处: Vuex-Mutation]
  private TOGGLE_DEVICE(device: DeviceType) {
    // 知识点：修改 Vuex state 中的 device。[出处: Vuex-Mutation]
    this.device = device
  }

  // 知识点：@Action 标记给组件调用的动作，Action 可以包含业务流程，再调用 Mutation 改状态。[出处: Vuex-Action]
  @Action
  // 知识点：ToggleSideBar 是对外暴露的方法，组件调用它来切换侧边栏。[出处: Vuex-Action]
  public ToggleSideBar(withoutAnimation: boolean) {
    // 知识点：Action 内部调用 Mutation，真正修改 state。[出处: Vuex-Action, Vuex-Mutation]
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  // 知识点：@Action 标记关闭侧边栏动作。[出处: Vuex-Action]
  @Action
  // 知识点：CloseSideBar 对外提供关闭侧边栏能力。[出处: Vuex-Action]
  public CloseSideBar(withoutAnimation: boolean) {
    // 知识点：调用 CLOSE_SIDEBAR Mutation 修改 state。[出处: Vuex-Action, Vuex-Mutation]
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  // 知识点：@Action 标记切换设备类型动作。[出处: Vuex-Action]
  @Action
  // 知识点：ToggleDevice 对外提供切换移动端/桌面端状态的能力。[出处: Vuex-Action]
  public ToggleDevice(device: DeviceType) {
    // 知识点：调用 TOGGLE_DEVICE Mutation 修改 device。[出处: Vuex-Action, Vuex-Mutation]
    this.TOGGLE_DEVICE(device)
  }

  // 知识点：@Action 标记修改顶部状态数字动作。[出处: Vuex-Action]
  @Action
  // 知识点：StatusNumber 对外提供修改 statusNumber 的能力。[出处: Vuex-Action]
  public StatusNumber(device: any) {
    // 知识点：调用 STATUS_NUMBER Mutation 修改 statusNumber。[出处: Vuex-Action, Vuex-Mutation]
    this.STATUS_NUMBER(device)
  }
}

// 知识点：getModule 把 class 模块转换成可直接调用的模块实例，例如 AppModule.ToggleSideBar()。[出处: Vuex-Store]
export const AppModule = getModule(App)
