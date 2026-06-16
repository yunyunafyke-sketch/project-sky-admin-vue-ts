import request from '@/utils/request'

// 消息通知接口。
// 顶部栏的新订单/催单提示、消息列表和已读状态都会走这里。

// 获取消息分页列表。
export const getInformData = (params: any) => {
  return request({
    url: '/messages/page',
    method: 'get',
    params,
  },)
}

// 获取未读消息数量。
export const getCountUnread = () => {
  return request({
    url: '/messages/countUnread',
    method: 'get'
  },)
}

// 批量标记已读。
export const batchMsg = (data: any) => {
  return request({
    url: '/messages/batch',
    method: 'put',
    data
  })
}

// 标记单条消息已读。
export const setStatus = (params: any) => {
  return request({
    url: `/messages/${params}`,
    method: 'PUT'
  })
}
