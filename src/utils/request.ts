// 知识点：axios 是前端最常用的 HTTP 请求库，用来调用后端接口。[出处: Axios-实例]
import axios, { AxiosAdapter } from 'axios'
// 知识点：Element UI 的 Message/MessageBox 用于页面提示和确认弹窗。[出处: ElementUI-组件]
import { Message, MessageBox } from 'element-ui'
// 知识点：从 Vuex 用户模块读取 token，统一给接口请求加登录凭证。[出处: Vuex-Store]
import { UserModule } from '@/store/modules/user'
// 知识点：从 requestOptimize 导入重复请求控制相关工具函数和 pending 状态表。[出处: JS-模块, Axios-取消请求]
import {
  // 知识点：getRequestKey 用请求配置生成唯一 key，用于判断请求是否重复。[出处: JS-模块, Axios-取消请求]
  getRequestKey,
  // 知识点：pending 保存当前还没完成的请求 key。[出处: JS-对象, Axios-取消请求]
  pending,
  // 知识点：checkPending 检查某个请求 key 是否已经存在。[出处: JS-模块, Axios-取消请求]
  checkPending,
  // 知识点：removePending 在请求结束后移除请求 key。[出处: JS-模块, Axios-取消请求]
  removePending
} from './requestOptimize'
// 知识点：在请求或响应异常时，可以用 router 跳转到登录页。[出处: VueRouter-配置]
import router from '@/router'
// 知识点：CancelToken 是 axios 0.x 版本中取消请求的 API。[出处: Axios-取消请求]
const CancelToken = axios.CancelToken;

// 知识点：这里创建项目统一使用的 axios 实例。[出处: Axios-实例]
// 知识点：后续 src/api/*.ts 不直接用 axios，而是统一用这个 service，方便集中加 token、超时、错误处理。[出处: Axios-实例, Axios-拦截器]
const service = axios.create({
  // 知识点：baseURL 是所有接口地址的公共前缀，实际值来自 .env.development 或 .env.production。[出处: Axios-实例]
  baseURL: process.env.VUE_APP_BASE_API,
  // 知识点：timeout 表示请求最长等待时间，超过这个时间 axios 会认为请求失败。[出处: Axios-实例]
  'timeout': 600000
})

// 知识点：请求拦截器会在请求真正发出去之前执行。[出处: Axios-拦截器]
service.interceptors.request.use(
  (config: any) => {
    // 知识点：config 是本次请求的配置对象，包含 url、method、params、data、headers 等信息。[出处: Axios-拦截器]
    // console.log(config, 'config')
    // config.data = config.params
    // 知识点：已登录时把 token 放到请求头，后端靠这个识别当前用户。[出处: Axios-拦截器]
    if (UserModule.token) {
      // 知识点：headers 是请求头，token 常用于后端鉴权。[出处: Axios-拦截器]
      config.headers['token'] = UserModule.token
    } else if (UserModule.token && config.url != '/login') {
      // 知识点：window.location.href 会让浏览器整页跳转，通常用于强制回登录页。[出处: JS-对象]
      window.location.href = '/login'
      return false
    }

    // config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['Content-Type'] = 'application/json;'
    // 知识点：GET 请求的参数通常放在 params。[出处: Axios-实例]
    // 知识点：这里手动把 params 拼到 url 上，是为了让后面的“重复请求 key”能稳定包含查询参数。[出处: Axios-取消请求]
    if (config.method === 'get' && config.params) {
      // 知识点：GET 请求一般长这样：/category/page?page=1&pageSize=10。[出处: Axios-实例]
      let url = config.url + '?';
      // 知识点：Object.keys(obj) 可以拿到对象所有字段名，适合遍历查询参数。[出处: JS-对象]
      for (const propName of Object.keys(config.params)) {
        // 知识点：propName 是参数名，value 是参数值。[出处: JS-对象]
        const value = config.params[propName];
        // 知识点：encodeURIComponent 用来转义中文、空格等特殊字符，避免 URL 出错。[出处: JS-对象]
        var part = encodeURIComponent(propName) + '=';
        // 知识点：null 和 undefined 一般不应该拼进查询参数。[出处: JS-对象]
        if (value !== null && typeof (value) !== 'undefined') {
          // 知识点：如果参数值是对象，需要继续展开成 key=value 的形式。[出处: JS-对象]
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              // 知识点：这种写法会把对象参数拼成 xxx[key]=value 的形式。[出处: JS-对象]
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + '=';
              url += subPart + encodeURIComponent(value[key]) + '&';
            }
          } else {
            // 知识点：普通字符串、数字、布尔值直接拼到 URL 后面。[出处: JS-对象]
            url += part + encodeURIComponent(value) + '&';
          }
        }
      }
      // 知识点：去掉最后多出来的 &，让 URL 更规范。[出处: JS-对象]
      url = url.slice(0, -1);
      // 知识点：参数已经手动拼到 url 上，所以这里把 params 清空，避免 axios 再拼一次。[出处: Axios-实例]
      config.params = {};
      config.url = url;
    }
    // 知识点：计算当前请求 key，用于判断是否是重复请求。[出处: Axios-取消请求]
    const key = getRequestKey(config);
    // console.log(pending,key,checkPending(key),'checkPending(key)')
    if (checkPending(key)) {
      // 知识点：如果同一个请求还没结束，又发起一次相同请求，就取消新的这次请求。[出处: Axios-取消请求]
      const source = CancelToken.source();
      // 知识点：cancelToken 绑定到本次请求上，source.cancel 执行后 axios 会中断请求。[出处: Axios-取消请求]
      config.cancelToken = source.token;
      source.cancel('重复请求');
    } else {
      // 知识点：记录请求正在进行中。响应回来或报错后，会在响应拦截器里删除。[出处: JS-对象, Axios-取消请求]
      pending[key] = true;
    }
    return config
  },
  (error: any) => {
    // 知识点：请求还没发出去就失败时，会进入这里。[出处: Axios-拦截器]
    Promise.reject(error)
  }
)

// 知识点：响应拦截器会在后端响应回来后先执行，再回到具体业务代码。[出处: Axios-拦截器]
service.interceptors.response.use(
  (response: any) => {
    // 知识点：response 是后端返回的完整响应对象，真正的业务数据通常在 response.data 里。[出处: Axios-拦截器]
    // console.log(response, 'response')
    // 知识点：后端返回 401 代表登录态失效，跳回登录页。[出处: Axios-拦截器, VueRouter-配置]
    if (response.data.status === 401) {
      router.push('/login')
      // const res = response.data
      // return response
    }
    // 知识点：请求响应中的 config.url 可能带代理前缀 /api，删除后才能和 requestOptimize 里生成的 key 对上。[出处: Axios-取消请求]
    response.config.url = response.config.url.replace('/api', '')
    // 知识点：请求完成后，从 pending 表中删除，这样后续相同请求可以继续发送。[出处: Axios-取消请求]
    const key = getRequestKey(response.config);
    removePending(key);
    // if (response.data.code === 0) {
    //   Message.error(response.data.msg)
    //   // if(response.data.msg === 'NOTLOGIN' || response.data.msg === '未登录'){
    //   //   router.push('/login')
    //   // }
    //   // return window.location.href = '/login'
    //   // window.location.href = '/login'
    //   // return false
    // } else
    if (response.data.code === 1) {
      // const res = response.data
      // 知识点：这里直接返回 response，页面中再通过 res.data 读取后端数据。[出处: Axios-拦截器]
      return response
    }
    return response
  },
  (error: any) => {
    // 知识点：响应失败包括网络错误、超时、HTTP 状态码异常等。[出处: Axios-拦截器]
    // console.log(error.config, pending, 'error')
    // 知识点：HTTP 状态码级别的错误会走这里，比如 401、405、500。[出处: Axios-拦截器]
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          // 知识点：401 通常表示未登录或登录过期。[出处: Axios-拦截器]
          router.push('/login')
          break;
        case 405:
          // 知识点：405 通常表示请求方法不允许，比如后端要 POST，前端却发了 GET。[出处: Axios-拦截器]
          error.message = '请求错误'
      }
    }
    // 知识点：报错也要清理 pending，否则同一个请求会一直被当作“重复请求”。[出处: Axios-取消请求]
    error.config.url = error.config.url.replace('/api', '')
    const key = getRequestKey(error.config);
    removePending(key);
    // console.log(error, pending, 'error11')
    // Message({
    //   'message': error.message,
    //   'type': 'error',
    //   'duration': 5 * 1000
    // })
    // router.push('/login')
    // 知识点：返回 reject 后，具体页面的 try/catch 或 .catch 才能继续处理错误。[出处: JS-Promise, Axios-拦截器]
    return Promise.reject(error)
  }
)

// 知识点：导出统一请求实例，src/api/*.ts 会基于它封装具体业务接口。[出处: JS-模块, Axios-实例]
export default service
