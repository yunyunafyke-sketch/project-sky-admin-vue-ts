import request from '@/utils/request'

// 用户和店铺状态相关接口。

// 修改当前登录用户密码。
export const editPassword = (data: any) =>
  request({
    'url': '/employee/editPassword',
    'method': 'put',
    data
  })

// 获取店铺营业状态：通常返回营业中/打烊中。
export const getStatus = () =>
  request({
    'url': `/shop/status`,
    'method': 'get'
  })

// 设置店铺营业状态，data 会拼到路径上，比如 /shop/1 或 /shop/0。
export const setStatus = (data:any) =>
  request({
    'url': `/shop/`+data,
    'method': 'put',
    'data':data
  })
