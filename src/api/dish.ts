import request from '@/utils/request'

/**
 * 菜品管理接口。
 * 页面里新增、编辑、删除、上下架菜品，最终都会调用这里的函数。
 */

// 查询菜品分页列表。
export const getDishPage = (params: any) => {
  return request({
    url: '/dish/page',
    method: 'get',
    params
  })
}

// 删除菜品，ids 通常是一个或多个菜品 id 拼成的字符串。
export const deleteDish = (ids: string) => {
  return request({
    url: '/dish',
    method: 'delete',
    params: { ids }
  })
}

// 修改菜品基础信息、规格、口味等。
export const editDish = (params: any) => {
  return request({
    url: '/dish',
    method: 'put',
    data: { ...params }
  })
}

// 新增菜品。
export const addDish = (params: any) => {
  return request({
    url: '/dish',
    method: 'post',
    data: { ...params }
  })
}

// 根据菜品 id 查询详情，编辑页回显表单时使用。
export const queryDishById = (id: string | (string | null)[]) => {
  return request({
    url: `/dish/${id}`,
    method: 'get'
  })
}

// 获取菜品分类列表，用于新增/编辑菜品时选择分类。
export const getCategoryList = (params: any) => {
  return request({
    url: '/category/list',
    method: 'get',
    params
  })
}

// 查询菜品列表，常用于套餐里选择菜品。
export const queryDishList = (params: any) => {
  return request({
    url: '/dish/list',
    method: 'get',
    params
  })
}

// 根据文件名下载或预览公共资源。
export const commonDownload = (params: any) => {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/common/download',
    method: 'get',
    params
  })
}

// 起售/停售菜品。status 放在路径里，id 放在查询参数里。
export const dishStatusByStatus = (params: any) => {
  return request({
    url: `/dish/status/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}

// 菜品分类数据查询，和 getCategoryList 类似，保留给不同页面调用。
export const dishCategoryList = (params: any) => {
  return request({
    url: `/category/list`,
    method: 'get',
    params: { ...params }
  })
}
