import request from '@/utils/request'

/**
 * 员工管理接口。
 * 这一类文件只负责“封装请求”，页面组件调用这些函数即可，不直接写 axios。
 */

// 登录：提交用户名和密码，后端返回 token 和用户信息。
export const login = (data: any) =>
  request({
    'url': '/employee/login',
    'method': 'post',
    data
  })

// 退出登录：通知后端当前用户退出。
export const userLogout = (params: any) =>
  request({
    'url': `/employee/logout`, // 授课老师接口
    'method': 'post',
    params
  })

// 员工分页列表，通常由员工管理页的表格调用。
export const getEmployeeList = (params: any) => {
  return request({
    url: '/employee/page',
    method: 'get',
    params: params
  })
}

// 启用/禁用员工账号。status 放在路径里，员工 id 放在查询参数里。
export const enableOrDisableEmployee = (params: any) => {
  return request({
    url: `/employee/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}

// 新增员工。
export const addEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'post',
    data: { ...params }
  })
}

// 编辑员工。
export const editEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'put',
    data: { ...params }
  })
}

// 根据员工 id 查询详情，编辑页进入时会用它回显表单。
export const queryEmployeeById = (id: string | (string | null)[]) => {
  return request({
    url: `/employee/${id}`,
    method: 'get'
  })
}
