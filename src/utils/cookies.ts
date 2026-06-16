import Cookies from 'js-cookie';

// 这个文件统一封装 Cookie 读写。
// 好处是：Cookie key 只在这里定义一次，别的文件不用到处手写 'token'、'storeId'。

// App：左侧菜单展开/收起状态。
const sidebarStatusKey = 'sidebar_status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus);

// User：当前门店 id。
const storeId = 'storeId';
export const getStoreId = () => Cookies.get(storeId);
export const setStoreId = (id: string) => Cookies.set(storeId, id);
export const removeStoreId = () => Cookies.remove(storeId);

// User：登录 token，后端用它判断当前请求属于哪个用户。
const tokenKey = 'token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);

// User：用户信息。这里存对象时 js-cookie 会转成字符串，读取后通常需要 JSON.parse。
const userInfoKey = 'userInfo';
export const getUserInfo = () => Cookies.get(userInfoKey);
export const setUserInfo = (useInfor: Object) => Cookies.set(userInfoKey, useInfor);
export const removeUserInfo = () => Cookies.remove(userInfoKey);

// Print：打印相关设置。
const printKey = 'print';
export const getPrint = () => Cookies.get(printKey);
export const setPrint = (useInfor: Object) => Cookies.set(printKey, useInfor);
export const removePrint = () => Cookies.remove(printKey);

// 消息数量或消息状态。
const newData = 'new';
export const getNewData = () => Cookies.get(newData);
export const setNewData = (val: Object) => Cookies.set(newData, val);
