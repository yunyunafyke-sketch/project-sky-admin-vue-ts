// 是否开启“删除权限”相关功能，由环境变量 VUE_APP_DELETE_PERMISSIONS 控制。
export const checkProcessEnv =() => {
  return process.env.VUE_APP_DELETE_PERMISSIONS==='true'
}

// 防抖：连续触发时只执行最后一次。
// 常用于搜索框输入、窗口 resize 等场景，避免频繁调用接口或计算。
export const debounce=(fn, time) => {
  time = time || 200
  // timer 保存上一次计划执行的任务。
  let timer = null
  return function(...args) {
    var _this = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      timer = null
      fn.apply(_this, args)
    }, time)
  }

};

// 节流：一段时间内最多执行一次。
// 常用于滚动、拖拽、按钮连续点击等场景。
export const throttle = (fn, time) => {
  let timer = null
  time = time || 1000
  return function(...args) {
    if (timer) {
      return
    }
    const _this = this
    timer = setTimeout(() => {
      timer = null
    }, time)
    fn.apply(_this, args)
  }
}

// 判断字符串形式的数字是否以负号开头。
export const strIncrease = (str) => {
  if(str.slice(0,1) ==='-'){
    return true
    }
}
