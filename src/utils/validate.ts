// 校验用户名是否在允许列表里。当前项目登录页并没有真正使用这个规则。
export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0;

// 判断路径是否是外部链接。
// 侧边栏会用它区分应该用 <a> 还是 <router-link>。
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path);
