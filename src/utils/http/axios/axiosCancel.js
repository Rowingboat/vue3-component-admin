// @ts-nocheck
import axios from 'axios';

import { isFunction } from '@/utils/is';

//如果当前没有等待的请求，添加itUsed来存储每个请求的识别和取消功能
let pendingMap = new Map();

export const getPendingUrl = (config) => [config.method, config.url].join('&');

export class AxiosCanceler {
  /**
   * 添加请求
   * @param {Object} config
   */
  addPending(config) {
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          //如果当前没有挂起的请求，添加它
          pendingMap.set(url, cancel);
        }
      });
  }

  /**
   * @description: 清空所有pending
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }

  /**
   *  移除请求
   * @param {Object} config
   */
  removePending(config) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      //如果有一个当前请求标识符在等待中，
      //当前请求需要被取消和删除
      const cancel = pendingMap.get(url);
      cancel && cancel(url);
      pendingMap.delete(url);
    }
  }

  /**
   * @description:  重置
   */
  reset() {
    pendingMap = new Map();
  }
}
