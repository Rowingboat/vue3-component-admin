import { isObject } from '@/utils/is';

// 深度合并
export function deepMerge(src = {}, target = {}) {
    let key;
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}

/**
 * 将对象作为参数添加到URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl, obj) {
    let parameters = '';
    for (const key in obj) {
        parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * 导入模块
 * require.context('./modules', false, /\.js$/)
 * @param {*} context
 */
export const importAll = (context) => {
    const map = {};
    for (const key of context.keys()) {
        if (key.indexOf('src') == -1) {
            const keyArr = key.split('/');
            keyArr.shift(); // 移除.
            map[
                keyArr
                    .join('.')
                    .replace(/\.js$/g, '')
                    .replace(/\.vue$/g, '')
            ] = context(key);
        }
    }
    return map;
};

export function getRawRoute(route) {
    if (!route) return route;
    const { matched, ...opt } = route;
    return {
        ...opt,
        matched: matched
            ? matched.map((item) => ({
                  meta: item.meta,
                  name: item.name,
                  path: item.path,
              }))
            : undefined,
    };
}

export const withInstall = (component, alias) => {
    const comp = component;
    comp.install = (app) => {
        app.component(comp.name || comp.displayName, component);
        if (alias) {
            app.config.globalProperties[alias] = component;
        }
    };
    return component;
};
