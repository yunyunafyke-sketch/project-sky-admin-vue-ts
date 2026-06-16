import request from '@/utils/request';

/**
 * 分类管理接口。
 * 分类一般分为“菜品分类”和“套餐分类”，页面通过 type 字段区分。
 */

// 查询分类分页列表。
export const getCategoryPage = (params: any) => {
  return request({
    url: '/category/page',
    method: 'get',
    params
  });
};

// 删除分类。当前接口参数名是 id，调用方传入 ids 字符串。
export const deleCategory = (ids: string) => {
  return request({
    url: '/category',
    method: 'delete',
    params: { id:ids }
  });
};

// 修改分类名称、排序、类型等信息。
export const editCategory = (params: any) => {
  return request({
    url: '/category',
    method: 'put',
    data: { ...params }
  });
};

// 新增分类。
export const addCategory = (params: any) => {
  return request({
    url: '/category',
    method: 'post',
    data: { ...params }
  });
};

// 启用/禁用分类。status 放在路径里，分类 id 放在查询参数里。
export const enableOrDisableEmployee = (params: any) => {
  return request({
    url: `/category/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}
