import md5 from 'md5';

// 根据请求地址、请求方式、请求参数，计算一个 md5 值作为请求唯一 key。
// 这样可以判断“当前是否已经有一个完全相同的请求正在进行”。
const getRequestKey = (config) => {
    if (!config) {
        // 如果没有获取到请求配置，就用当前时间生成一个兜底 key。
        return md5(+new Date());
    }

    const data = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
    // console.log(config,pending,config.url,md5(config.url + '&' + config.method + '&' + data),'config')
    return md5(config.url + '&' + config.method + '&' + data);
}

// pending 存储正在进行中的请求 key。
// 结构大概是：{ "md5后的请求key": true }
const pending = {};
// 检查某个请求 key 是否已经存在。
const checkPending = (key) => !!pending[key];
// 请求完成或失败后删除 key，允许下次再发相同请求。
const removePending = (key) => {
    // console.log(key,'key')
    delete pending[key];
};

export {
    getRequestKey,
    pending,
    checkPending,
    removePending
}
