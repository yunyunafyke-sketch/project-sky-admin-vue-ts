import request from '@/utils/request'

/**
 * 套餐管理接口。
 * 套餐通常由多个菜品组成，新增/编辑套餐时会同时处理套餐信息和包含的菜品。
 */

// 查询套餐分页列表。
export const getSetmealPage = (params: any) => {
  return request({
    url: '/setmeal/page',
    method: 'get',
    params,
  },)
}

// 删除套餐，ids 通常是一个或多个套餐 id 拼成的字符串。
export const deleteSetmeal = (ids: string) => {
  return request({
    url: '/setmeal',
    method: 'delete',
    params: { ids }
  })
}

// 修改套餐信息。
export const editSetmeal = (params: any) => {
  return request({
    url: '/setmeal',
    method: 'put',
    data: { ...params }
  })
}

// 新增套餐。
export const addSetmeal = (params: any) => {
  return request({
    url: '/setmeal',
    method: 'post',
    data: { ...params }
  })
}

// 根据套餐 id 查询详情，编辑页回显表单时使用。
export const querySetmealById = (id: string | (string | null)[]) => {
  return request({
    url: `/setmeal/${id}`,
    method: 'get'
  })
}

// 批量起售/停售套餐。
export const setmealStatusByStatus = (params: any) => {
  return request({
    url: `/setmeal/status/${params.status}`,
    method: 'post',
    params: { id: params.ids }
  })
}

// 菜品分类数据查询，用于套餐中选择菜品分类。
export const dishCategoryList = (params: any) => {
  return request({
    url: `/category/list`,
    method: 'get',
    params: { ...params }
  })
}
