import request from '@/utils/request'

// 工作台和数据统计接口。
// 工作台接口一般给首页卡片用，report 接口一般给“数据统计”页面和图表用。

// 营业额数据
// export const getTurnoverDataes = (data) =>
//   request({
//     'url': `/report/turnoverStatistics`,
//     'method': 'get',
//     data
//   })
// 首页数据
// // 今日数据
// export const getTodayDataes = () =>
//   request({
//     'url': `/workspace/todaydate`,
//     'method': 'get'
//   })

// 工作台：订单总览。
export const getOrderData = () =>
  request({
    'url': `/workspace/overviewOrders`,
    'method': 'get'
  })

// 工作台：菜品总览。
export const getOverviewDishes = () =>
  request({
    'url': `/workspace/overviewDishes`,
    'method': 'get'
  })

// 工作台：套餐总览。
export const getSetMealStatistics = () =>
  request({
    'url': `/workspace/overviewSetmeals`,
    'method': 'get'
  })

// 工作台：营业数据。
export const getBusinessData= () =>
  request({
    'url': `/workspace/businessData`,
    'method': 'get'
  })

/**
 * 报表数据
 */
// 统计
// 获取当日销售数据 -> 顶部数据
// export const getDataes = (params: any) =>
//   request({
//     'url': `/report/amountCollect/${params.date}`,
//     'method': 'get'
//   })

// 数据统计：营业额统计。
export const getTurnoverStatistics= (params: any) =>
  request({
    'url': `/report/turnoverStatistics`,
    'method': 'get',
    params
  })

// 数据统计：用户统计。
export const getUserStatistics= (params: any) =>
  request({
    'url': `/report/userStatistics`,
    'method': 'get',
    params
  })

// 数据统计：订单统计。
export const getOrderStatistics= (params: any) =>
  request({
    'url': `/report/ordersStatistics`,
    'method': 'get',
    params
  })

// 数据统计：销量排名 TOP10。
export const getTop= (params: any) =>
  request({
    'url': `/report/top10`,
    'method': 'get',
    params
  })

// 数据统计：数据概览。
export const getDataOverView= (params: any) =>
  request({
    'url': `/report/dataOverView`,
    'method': 'get',
    params
  })

// 导出报表。responseType=blob 表示后端返回的是文件流。
export function exportInfor() {
  return request({
    url: '/report/export',
    method: 'get',
    responseType: "blob"
  })
}
