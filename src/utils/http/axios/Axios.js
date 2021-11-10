import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axiosCancel';
import { cloneDeep, omit } from 'lodash-es';
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum';
import { isFunction } from '@/utils/is';

export class DAxios {
    #axiosInstance;
    #options;
    constructor(options) {
        this.#options = options;
        this.#axiosInstance = axios.create(options);
        this.#setupInterceptors();
    }

    /**
     * @description:  创建axios实例
     */
    #createAxios(config) {
        this.#axiosInstance = axios.create(config);
    }

    #getTransform() {
        const { transform } = this.#options;
        return transform;
    }

    getAxios() {
        return this.#axiosInstance;
    }

    /**
     * @description: 配置 axios
     */
    configAxios(config) {
        if (!this.#axiosInstance) {
            return;
        }
        this.#createAxios(config);
    }

    /**
     * @description: 设置全局请求头
     */
    setHeader(headers) {
        if (!this.#axiosInstance) {
            return;
        }
        Object.assign(this.#axiosInstance.defaults.headers, headers);
    }

    /**
     * @description: 拦截器配置
     */
    #setupInterceptors() {
        const transform = this.#getTransform();
        if (!transform) {
            return;
        }
        const {
            requestInterceptors, // 请求之前的拦截器
            requestInterceptorsCatch, // 请求之前的拦截器错误处理
            responseInterceptors, // 请求之后的拦截器 响应拦截处理
            responseInterceptorsCatch, //请求之后的拦截器错误处理 响应错误处理
        } = transform;

        //创建 取消请求实例
        const axiosCanceler = new AxiosCanceler();

        // 请求拦截器配置处理
        this.#axiosInstance.interceptors.request.use((config) => {
            // 如果“取消重复请求”开启，则禁止“取消重复请求”
            const {
                headers: { ignoreCancelToken },
            } = config;

            const ignoreCancel =
                ignoreCancelToken !== undefined ? ignoreCancelToken : this.#options.requestOptions?.ignoreCancelToken;

            !ignoreCancel && axiosCanceler.addPending(config);
            if (requestInterceptors && isFunction(requestInterceptors)) {
                config = requestInterceptors(config);
            }
            return config;
        }, undefined);

        // 请求拦截器错误捕获
        requestInterceptorsCatch &&
            isFunction(requestInterceptorsCatch) &&
            this.#axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

        // 响应结果拦截器处理
        this.#axiosInstance.interceptors.response.use((res) => {
            res && axiosCanceler.removePending(res.config);
            if (responseInterceptors && isFunction(responseInterceptors)) {
                res = responseInterceptors(res);
            }
            return res;
        }, undefined);

        // 响应结果拦截器错误捕获
        responseInterceptorsCatch &&
            isFunction(responseInterceptorsCatch) &&
            this.#axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
    }

    /**
     * @description:  File Upload
     */
    uploadFile(config, params) {
        const formData = new window.FormData();

        if (params.data) {
            Object.keys(params.data).forEach((key) => {
                if (!params.data) return;
                const value = params.data[key];
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(`${key}[]`, item);
                    });
                    return;
                }

                formData.append(key, params.data[key]);
            });
        }

        formData.append(params.name || 'file', params.file, params.filename);
        const customParams = omit(params, 'file', 'filename', 'file');

        Object.keys(customParams).forEach((key) => {
            formData.append(key, customParams[key]);
        });

        return this.#axiosInstance.request({
            ...config,
            method: 'POST',
            data: formData,
            headers: {
                'Content-type': ContentTypeEnum.FORM_DATA,
                ignoreCancelToken: true,
            },
        });
    }

    // support form-data
    supportFormData(config) {
        const headers = config?.headers || this.#options.headers;
        const contentType = headers?.['Content-Type'] || headers?.['content-type'];

        if (
            contentType !== ContentTypeEnum.FORM_URLENCODED ||
            !Reflect.has(config, 'data') ||
            config.method?.toUpperCase() === RequestEnum.GET
        ) {
            return config;
        }

        return {
            ...config,
            data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
        };
    }

    get(config, options) {
        return this.request({ ...config, method: 'GET' }, options);
    }

    post(config, options) {
        return this.request({ ...config, method: 'POST' }, options);
    }

    put(config, options) {
        return this.request({ ...config, method: 'PUT' }, options);
    }

    delete(config, options) {
        return this.request({ ...config, method: 'DELETE' }, options);
    }

    request(config, options) {
        let conf = cloneDeep(config);
        const transform = this.#getTransform();

        const { requestOptions } = this.#options;

        const opt = Object.assign({}, requestOptions, options);
        /**
         * requestCatchHook 请求失败处理
         *
         */
        const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt);
        }
        conf.requestOptions = opt;

        conf = this.supportFormData(conf);

        return new Promise((resolve, reject) => {
            this.#axiosInstance
                .request(conf)
                .then((res) => {
                    if (transformRequestHook && isFunction(transformRequestHook)) {
                        try {
                            const ret = transformRequestHook(res, opt);
                            resolve(ret);
                        } catch (err) {
                            reject(err || new Error('request error!'));
                        }
                        return;
                    }
                    resolve(res);
                })
                .catch((e) => {
                    if (requestCatchHook && isFunction(requestCatchHook)) {
                        reject(requestCatchHook(e, opt));
                        return;
                    }
                    reject(e);
                });
        });
    }
}
