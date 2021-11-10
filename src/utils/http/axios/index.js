// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { DAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { useStore } from "vuex"
import { useGlobSetting } from '@/utils/hooks/setting';
import { useMessage } from '@/utils/hooks/web/useMessage';
//请求方式
import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';
//判断
import { isString } from '@/utils/is';
// 缓存获取token
import { getToken } from '@/utils/auth';
//将对象作为参数添加到url  和 合并
import { setObjToUrlParams, deepMerge } from '@/utils';
//时间戳 格式化数据
import { joinTimestamp, formatRequestDate } from './helper';

// 获取全局变量配置
const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

const transform = {
    /**
     * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
     */
    transformRequestHook: (res, options) => {
        const { isTransformResponse, isReturnNativeResponse } = options;
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res;
        }
        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，data，message这些信息时开启
        if (!isTransformResponse) {
            return res.data;
        }

        // 错误的时候返回
        const { data } = res;
        if (!data) {
            // return '请求没有返回值';
            throw new Error('请求没有返回值');
        }

        //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
        const { code, result, message } = data;

        // 这里逻辑可以根据项目进行修改
        const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
        if (hasSuccess) {
            return result;
        }

        // 在此处根据自己项目的实际情况对不同的code执行不同的操作
        // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
        let timeoutMsg = '';
        switch (code) {
            case ResultEnum.TIMEOUT:
                timeoutMsg = 'timeoutMessage';
                break;
            default:
                if (message) {
                    timeoutMsg = message;
                }
                break;
        }

        throw new Error(timeoutMsg || 'apiRequestFailed');
    },

    // 请求之前处理config
    beforeRequestHook: (config, options) => {
        const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

        if (joinPrefix) {
            config.url = `${urlPrefix}${config.url}`;
        }

        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`;
        }

        const params = config.params || {};

        if (config.method?.toUpperCase() === RequestEnum.GET) {
            if (!isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
            } else {
                // 兼容restful风格
                config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
                config.params = undefined;
            }
        } else {
            if (!isString(params)) {
                formatDate && formatRequestDate(params);
                config.data = params;
                config.params = undefined;
                if (joinParamsToUrl) {
                    config.url = setObjToUrlParams(config.url, config.data);
                }
            } else {
                // 兼容restful风格
                config.url = config.url + params;
                config.params = undefined;
            }
        }
        return config;
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config, options) => {
        // 请求之前处理config
        const token = getToken();
        if (token) {
            // jwt token
            config.headers.Authorization = options.authenticationScheme
                ? `${options.authenticationScheme} ${token}`
                : token;
        }
        return config;
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res) => {
        return res;
    },

    /**
     * @description: 响应错误处理
     */

    responseInterceptorsCatch: (error) => {
        const store = useStore();
        store.dispatch('errorLog/addAjaxErrorInfo',error)
        const { response, code, message, config } = error || {};
        const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
        const msg = response?.data?.error?.message ?? '';
        const err = error?.toString?.() ?? '';
        let errMessage = '';

        try {
            if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
                errMessage = '请求超时！';
            }

            if (err?.includes('Network Error')) {
                errMessage = '网络错误！';
            }

            if (errMessage) {
                if (errorMessageMode === 'modal') {
                    createErrorModal({ title: '请求失败！', content: errMessage });
                } else if (errorMessageMode === 'message') {
                    createMessage.error(errMessage);
                }
                return Promise.reject(error);
            }
        } catch (error) {
            throw new Error(error);
        }

        checkStatus(error?.response?.status, msg, errorMessageMode);
        return Promise.reject(error);
    },
};

function createAxios(opt) {
    return new DAxios(
        deepMerge(
            {
                timeout: 10 * 1000,
                // 基础接口地址
                // baseURL: globSetting.apiUrl,
                // 接口可能会有通用的地址部分，可以统一抽取出来
                urlPrefix: urlPrefix,
                headers: { 'Content-Type': ContentTypeEnum.JSON },
                // 如果是form-data格式
                // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
                // 数据处理方式
                transform,
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // 默认将prefix 添加到url
                    joinPrefix: true,
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    // 需要对返回数据进行处理
                    isTransformResponse: true,
                    // post请求的时候添加参数到url
                    joinParamsToUrl: false,
                    // 格式化提交参数时间
                    formatDate: true,
                    // 消息提示类型
                    errorMessageMode: 'message',
                    // 接口地址
                    apiUrl: globSetting.apiUrl,
                    //  是否加入时间戳
                    joinTime: true,
                    // 忽略重复请求
                    ignoreCancelToken: true,
                },
            },
            opt || {}
        )
    );
}

export const defHttp = createAxios();
